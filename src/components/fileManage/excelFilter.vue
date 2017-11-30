<template>
    <div class="excel-filter">
        <Upload action="http://192.168.246.130:3000/upload-file">
            <Button type="ghost" icon="ios-cloud-upload-outline">数据导入</Button>
        </Upload>
        <Table ref="table" class="table" :columns="columns" :data="tableData"></Table>
        <div class="tool-btn-group">
            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> Export source data</Button>
            <Button type="primary" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> Export sorting and filtered data</Button>
            <Button type="primary" @click="exportData(3)"><Icon type="ios-download-outline"></Icon> Export custom data</Button>
        </div>
    </div>
</template>

<script>
export default {
    name: "excelFilter",
    data() {
        return {
            columns: [],
            tableData: []
        };
    },
    created() {
        console.log(_)
        this.$http.get('src/mock/mock.json').then((response) => {
            const data = response.data.data
            console.log(data.cloumns)
            for(let i = 0; i < data.cloumns.length; i++) {
                this.columns.push({
                    title: data.cloumns[i],
                    key: data.cloumns[i]
                })
            }
             this.tableData = data.data;
        }, (error) =>{
            console.log(error)
        })
    },
    methods: {
        importFile() {

        },
        exportData(type) {
            if (type === 1) {
                this.$refs.table.exportCsv({
                    filename: 'The original data'
                });
            } else if (type === 2) {
                this.$refs.table.exportCsv({
                    filename: 'Sorting and filtering data',
                    original: false
                });
            } else if (type === 3) {
                this.$refs.table.exportCsv({
                    filename: 'Custom data',
                    columns: this.columns.filter((col, index) => index < 4),
                    data: this.tableData.filter((data, index) => index < 4)
                });
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.excel-filter {
    width: calc(100% - 250px);
    height: 100%;
    padding: 8px 16px 8px 0;
    .table {
        height: calc(100% - 88px);
    }
    .tool-btn-group {
        margin-top: 8px;
        height: 40px;
    }
}
</style>
