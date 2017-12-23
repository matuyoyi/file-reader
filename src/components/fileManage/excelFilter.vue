<template>
    <div class="filter-area excel-filter">
        <div class="upload">
            <Upload :action='actionUrl' :before-upload="handleUpload" :on-success="uploadSuccess" :show-upload-list="false">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传Excel文件</Button>
            </Upload>
            <Input class="search-input" icon="search" v-model="keyword" placeholder="表格内搜索"></Input>
            <div class="tool-btn-group">
                <Button type="primary" :disabled="disabled" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> Export source data</Button>
                <Button type="primary" :disabled="disabled" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> Export filtered data</Button>
            </div>
        </div>
        <div class="table-area">
            <Tabs type="card" :animated="false" @on-click="handleChangeTab">
                <TabPane v-for="(sheet,index) in sheetList" :key="sheet.name" :label="sheet.name">
                </TabPane>
            </Tabs>
            <div class="checkbox-group">
                <Checkbox class="check-all" v-show="checkColumns.length > 0" v-model="selectAll" @on-change="handleChangeAll">全部</Checkbox>
                <CheckboxGroup v-model="checkedGroup" @on-change="changeTableColumns">
                    <Checkbox v-for="item in checkColumns" :key="item.title" :label="item.title">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </div>
            <Table ref="table" class="table" :columns="currentColumns" :data="currentTable"></Table>
        </div>
        <!-- select the filter column -->
        <Modal
            v-model="showModal"
            title="导出既定时间范围内的数据"
            @on-ok="timeFilter"
            @on-cancel="showModal = false">
            <Form :model="filterForm" :label-width="120">
                <FormItem label="选择时间字段">
                    <Select v-model="filterForm.filterColumn">
                        <Option v-for="item in availableColumns" :key="item" :label="item" :value="item"></Option>
                    </Select>
                </FormItem>
                <FormItem label="选择时间范围">
                    <TimePicker v-model="filterForm.filterTime" type="timerange" placement="bottom-end" placeholder="Select time" @on-change="selcetTime"></TimePicker>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import actionUrl from '../../../static/uploadconfig.json';

export default {
    name: "excelFilter",
    data() {
        return {
            columns: [],
            tableColumnsChecked: [],
            keyword: '',
            showModal: false,
            sheetList: [],
            currentIndex: 0,
            disabled: true,
            currentTable: [],
            currentColumns: [],
            filterForm: {
                filterColumn: '',
                filterTime: '',
            },
            timeRange: [],
            actionUrl: '',
        };
    },
    computed: {
        checkedGroup: {
            get() {
                const arr = [];
                _.each(this.currentColumns, (column) => {
                    arr.push(column.title)
                })
                return arr;
            },
            set() {}
        },
        checkColumns() {
            const arr = [];
            if(this.sheetList[this.currentIndex]) {
                _.each(this.sheetList[this.currentIndex].originalCol, (column) => {
                    arr.push({
                        title: column.title,
                    });
                })
            }
            return arr;
        },
        availableColumns() {
            if(this.sheetList.length > 0) {
                const arr = [];
                _.each(this.currentColumns, (item) => {
                    arr.push(item.title)
                })
                let cIndex = [];
                let delFlag = -1;
                _.each(this.currentColumns, (item, index) => {
                    _.each(this.sheetList[this.currentIndex].data, (data) => {
                        if (isNaN(data[item.title])) {
                            const str = data[item.title].replace(/[.:\s-\\]/g, '');
                            if(isNaN(parseInt(str))) {
                                cIndex.push(index);
                            }
                        } else if (data[item.title].toString().length < 8) {
                            cIndex.push(index);
                        }
                    })
                })
                cIndex = _.uniq(cIndex);
                _.each(cIndex, (item) => {
                    delFlag ++;
                    arr.splice(item - delFlag, 1);
                })
                return arr;
            } else {
                return [];
            }
        },
        width() {
            return this.$store.workbench.state.width;
        },
        selectAll() {
            return this.sheetList.length > 0 ? this.currentColumns.length === this.sheetList[this.currentIndex].originalCol.length : false;
        }
    },
    watch: {
        keyword(newVal, oldVal) {
            if(newVal) {
                this.currentTable.splice(0);
                const arr = [];
                _.each(this.sheetList[this.currentIndex].data,(sheet) => {
                    _.each(sheet, (value, key) => {
                        if(value.toString().toLowerCase().indexOf(newVal.toLowerCase()) > -1) {
                            arr.push(sheet);
                        }
                    })
                })
                this.currentTable = arr;
            } else {
                this.currentTable = this.sheetList[this.currentIndex].data.slice(0);
            }
        },
    },
    created() {
        this.$http('/static/uploadconfig.json').then((response) => {
            const url = response.data.url;
            this.actionUrl = `${url}/upload-file`;
        })
    },
    methods: {
        exportData(type) {
            if (type === 1) {
                this.$refs.table.exportCsv({
                    filename: 'The original data'
                });
            } else if (type === 2) {
                this.filterForm.filterColumn = this.availableColumns[0];
                this.showModal = true;
            }
        },
        uploadSuccess(response, file, fileList) {
            this.currentTable = [];
            this.currentColumns = [];
            this.sheetList = [];
            this.sheets = response;
            this.$Message.success('上传成功');
            _.each(this.sheets, (sheet) => {
                const columns = [];
                _.each(sheet.columns, (column) => {
                    columns.push({
                        title: column,
                        key: column,
                        sortable: true,
                    })
                })
                const data = sheet.data;
                const originalCol = columns.slice(0);
                const timeCol = columns.slice(0);
                this.sheetList.push({
                    name: sheet.name,
                    columns,
                    originalCol,
                    data,
                })
            })
            this.disabled = this.sheetList.data && this.sheetList[this.currentIndex].data.length > 0;
            this.currentTable = this.sheetList[this.currentIndex] && this.sheetList[this.currentIndex].data.slice(0) || [];
            this.currentColumns = this.sheetList[this.currentIndex] && this.sheetList[this.currentIndex].columns.slice(0) || [];
        },
        handleChangeAll(val) {
            if(val) {
                this.currentColumns = this.sheetList[this.currentIndex].originalCol.slice(0);
            } else {
                this.currentColumns.splice(0);
            }
        },
        changeTableColumns(val) {
            const arr = [];
            _.each(val, (item) => {
                arr.push({
                    title: item,
                    key: item,
                    sortable: true,
                })
            })
            this.currentColumns = arr;
        },
        handleUpload(file) {
            const appendix = file.name.replace(/.+\./, '');
            if(appendix !== 'csv' && appendix !== 'xlsx') {
                this.$Message.error('只能上传Excel文件！')
                return false;
            }
        },
        handleChangeTab(val) {
            this.keyword = '';
            this.currentIndex = val;
            this.disabled = this.sheetList.data && this.sheetList[this.currentIndex].data.length > 0;
            this.currentTable = this.sheetList[this.currentIndex] && this.sheetList[this.currentIndex].data.slice(0) || [];
            this.currentColumns = this.sheetList[this.currentIndex] && this.sheetList[this.currentIndex].columns.slice(0) || [];
        },
        timeFilter() {
            const arr = [];
            const arr2 = [];
            _.each(this.timeRange, (item) => {
                arr2.push(parseInt(item.replace(/[:\s-\\]/g, '')));
            })
            this.timeRange = arr2;
            let time;
            _.each(this.currentTable, (item) => {
                time = _.cloneDeep(item[this.filterForm.filterColumn]);
                if(time.length > 8) {
                    time = time.slice(-8);
                }
                time = time.replace(/[:\s-\\]/g, '');
                if( parseInt(time) > this.timeRange[0] && parseInt(time) < this.timeRange[1] ) {
                    arr.push(item);
                }
            })
            this.currentTable = arr;
            setTimeout(() => {
                this.$refs.table.exportCsv({
                    filename: 'The filtered data'
                });
            }, 250)
        },
        selcetTime(val) {
            this.timeRange = val
        }
    }
};
</script>

<style lang="scss">
.filter-area {
    .upload {
        margin-bottom: 8px;
        display: flex;
        .search-input {
            width: 300px;
            margin-left: 16px;
        }
        .tool-btn-group {
            height: 100%;
            margin-left: 55px;
        }
    }
    .table-area {
        height: calc(100% - 45px);
        .ivu-tabs {
            height: 40px;
            .ivu-tabs-content {
                height: 100%;
                .ivu-tabs-tabpane {
                    height: 100%;
                }
            }
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            .check-all {
                margin-right: 15px;
            }
        }
        .table {
            height: calc(100% - 60px);
            .ivu-table-body {
                height: calc(100% - 46px);
            }
        }
    }

}
</style>
