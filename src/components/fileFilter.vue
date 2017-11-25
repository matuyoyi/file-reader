<template>
    <div class="file-filter">
        <Upload action="http://localhost:3000/upload">
            <Button type="ghost" icon="ios-cloud-upload-outline">数据导入</Button>
        </Upload>
        <Table ref="table" :columns="columns" :data="tableData"></Table>
        <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> Export source data</Button>
        <Button type="primary" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> Export sorting and filtered data</Button>
        <Button type="primary" @click="exportData(3)"><Icon type="ios-download-outline"></Icon> Export custom data</Button>
    </div>
</template>

<script>
export default {
    name: "fileFilter",
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
    .file-filter {
        width: 100%;
        height: 100%;
    }
</style>
