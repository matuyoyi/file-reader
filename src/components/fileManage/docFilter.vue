<template>
    <div class="filter-area doc-filter">
        <Upload class="upload" action="http://192.168.246.130:3000/upload-file" :on-success="uploadSuccess" :show-upload-list="false">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传word文件</Button>
        </Upload>
        <div>
            {{data}}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: null,
        }
    },
    methods: {
        uploadSuccess(response, file, fileList) {
            console.log(response)
            this.$Message.success('上传成功');
            this.data = response;
        }
    }
}
</script>
