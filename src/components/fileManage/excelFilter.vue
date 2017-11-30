<template>
    <div class="filter-area excel-filter">
        <div class="upload">
            <Upload action="http://192.168.246.130:3000/upload-file" :before-upload="handleUpload" :on-success="uploadSuccess" :show-upload-list="false">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传Excel文件</Button>
            </Upload>
            <Input class="search-input" icon="search" v-model="keyword" placeholder="表格内搜索"></Input>
        </div>
        <div class="table-area">
            <div class="checkbox-group">
                <Checkbox v-show="originalCol.length > 0" v-model="selectAll" @on-change="handleChangeAll">全部</Checkbox>
                <Checkbox-group v-model="checkedGroup" @on-change="changeTableColumns">
                    <Checkbox v-for="item in originalCol" :key="item.title" :label="item.title">{{item.title}}</Checkbox>
                </Checkbox-group>
            </div>
            <Table ref="table" class="table" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="tool-btn-group">
            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> Export source data</Button>
            <Button type="primary" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> Export custom data</Button>
            <Button type="primary" @click="exportData(3)"><Icon type="ios-download-outline"></Icon> Export filtered data</Button>
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
            selectAll: true,
            keyword: '',
            filterColumn: '',
            showModal: false,
            showDateTimeModal: false,
        };
    },
    computed: {
        checkedGroup: {
            get() {
                const arr = [];
                _.each(this.columns, (item) => {
                    arr.push(item.title)
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
        }
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
            const data = response;
            this.$Message.success('上传成功');
            this.columns.splice(0)
            this.originalCol.splice(0);
            for(let i = 0; i < data.columns.length; i++) {
                this.columns.push({
                    title: data.columns[i],
                    key: data.columns[i]
                })
                this.originalCol = this.columns.slice(0);
            }
            this.tableData = data.data;
            this.originTableData = this.tableData.slice(0);
        },
        handleChangeAll(val) {
            if(val) {
                this.columns = this.originalCol.slice(0);
            } else {
                this.columns.splice(0);
            }
        },
        changeTableColumns(val) {
            const arr = [];
            _.each(val, (item) => {
                arr.push({
                    title: item,
                    key: item
                })
            })
            this.columns = arr;
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
    }
    .table-area {
        height: calc(100% - 88px);
        .checkbox-group {
            height: 40px;;
        }
        .table {
            height: calc(100% - 40px);
            .ivu-table-body {
                height: 100%;
            }
        }
    }
    .tool-btn-group {
        margin-top: 8px;
        height: 40px;
    }
}
</style>
