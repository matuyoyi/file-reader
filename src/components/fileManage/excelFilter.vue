<template>
    <div class="filter-area excel-filter">
        <div class="upload">
            <Upload action="http://192.168.246.130:3000/upload-file" :before-upload="handleUpload" :on-success="uploadSuccess" :show-upload-list="false">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传Excel文件</Button>
            </Upload>
            <Input class="search-input" icon="search" v-model="keyword" placeholder="表格内搜索"></Input>
            <div class="tool-btn-group">
                <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> Export source data</Button>
                <Button type="primary" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> Export custom data</Button>
                <Button type="primary" @click="exportData(3)"><Icon type="ios-download-outline"></Icon> Export filtered data</Button>
            </div>
        </div>
        <div class="table-area">
            <Tabs type="card" :animated="false" @on-click="handleChangeTab">
                <TabPane v-for="(sheet,index) in sheetList" :key="sheet.name" :label="sheet.name">
                    <div class="checkbox-group">
                        <Checkbox v-show="sheet.originalCol.length > 0" v-model="selectAll[index]" @on-change="handleChangeAll">全部</Checkbox>
                        <Checkbox-group v-model="checkedGroup[index]" @on-change="changeTableColumns">
                            <Checkbox v-for="item in sheet.originalCol" :key="item.title" :label="item.title">{{item.title}}</Checkbox>
                        </Checkbox-group>
                    </div>
                    <Table ref="table" class="table" :columns="sheet.columns" :data="sheet.data"></Table>
                </TabPane>
            </Tabs>

        </div>
        <!-- select the filter column -->
        <Modal
            v-model="showModal"
            title="选择时间范围">
            <Select v-model="filterColumn">
                <Option v-for="item in originalCol" :key="item.title" :label="item.title" :value="item.title"></Option>
            </Select>
        </Modal>
        <Modal
            v-model="showDateTimeModal"
            title="选择时间范围"
            @on-ok="handleSubmit"
            @on-cancel="handleCancel">
            <Row>
                <Col span="12">
                    <span>时间范围</span>
                    <TimePicker type="timerange" placement="bottom-end" placeholder="Select time" @on-change="selectTime"></TimePicker>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
export default {
    name: "excelFilter",
    data() {
        return {
            columns: [],
            tableData: [],
            originTableData: [],
            tableColumnsChecked: [],
            originalCol: [],
            selectAll: [],
            keyword: '',
            filterColumn: '',
            showModal: false,
            showDateTimeModal: false,
            sheetList: [],
            currentIndex: 0,
        };
    },
    computed: {
        checkedGroup: {
            get() {
                const arr = [];
                _.each(this.sheetList, (sheet) => {
                    const temp = [];
                    _.each(sheet.columns, (item) => {
                        temp.push(item.title)
                    })
                    arr.push(temp)
                })
                return arr;
            },
            set() {}
        }
    },
    watch: {
        keyword(newVal, oldVal) {
            if(newVal) {
                this.tableData.splice(0);
                const arr = [];
                _.each(this.originTableData, (item) => {
                    _.each(item, (value, key) => {
                        if(value.toString().toLowerCase().indexOf(newVal.toLowerCase()) > -1) {
                            arr.push(item);
                        }
                    })
                })
                this.tableData = arr;
            } else {
                this.tableData = this.originTableData.slice(0);
            }
        },
    },
    methods: {
        exportData(type) {
            if (type === 1) {
                this.$refs.table.exportCsv({
                    filename: 'The original data'
                });
            } else if (type === 2) {
                /* this.$refs.table.exportCsv({
                    filename: 'Sorting and filtering data',
                    original: false
                }); */
                this.showModal = true
            }
        },
        uploadSuccess(response, file, fileList) {
            this.sheets = null;
            this.sheets = response;

            this.$Message.success('上传成功');
            _.each(this.sheets, (sheet) => {
                this.selectAll.push(true);
                const columns = [];
                _.each(sheet.columns, (column) => {
                    columns.push({
                        title: column,
                        key: column,
                    })
                })
                const originalCol = columns.slice(0);
                this.sheetList.push({
                    name: sheet.name,
                    columns,
                    originalCol,
                    data: sheet.data,
                    originData: sheet.data,
                })
            })
            console.log(this.sheetList)
        },
        handleChangeAll(val) {
            if(val) {
                this.sheetList[this.currentIndex].columns = this.sheetList[this.currentIndex].originalCol.slice(0);
            } else {
                this.sheetList[this.currentIndex].columns.splice(0);
            }
        },
        changeTableColumns(val) {
            console.log(this.currentIndex)
            const arr = [];
            _.each(val, (item) => {
                arr.push({
                    title: item,
                    key: item
                })
            })
            this.sheetList[this.currentIndex].columns = arr;
        },
        handleUpload(file) {
            const appendix = file.name.replace(/.+\./, '');
            if(appendix !== 'csv' && appendix !== 'xlsx') {
                this.$Message.error('只能上传Excel文件！')
                return false;
            }
        },
        handleSubmit() {},
        handleCancel() {},
        selectTime(val) {
            this.filterTime = val
        },
        handleChangeTab(val) {
            this.currentIndex = val;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.filter-area {
    width: calc(100% - 250px);
    height: 100%;
    padding: 8px 16px 8px 0;
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
            height: 100%;
            .ivu-tabs-content {
                height: calc(100% - 40px);
                .ivu-tabs-tabpane {
                    height: 100%;
                    .checkbox-group {
                        height: 40px;;
                    }
                    .table {
                        height: calc(100% - 40px);
                        .ivu-table-body {
                            height: calc(100% - 46px);
                        }
                    }
                }
            }
        }
    }

}
</style>
