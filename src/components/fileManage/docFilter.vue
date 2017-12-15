<template>
    <div class="filter-area doc-filter">
        <Upload class="upload" :action="actionUrl" :on-success="uploadSuccess" :show-upload-list="false">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传word文件</Button>
        </Upload>
        <div>
            {{data}}
        </div>
    </div>
</template>

<script>
import actionUrl from '../../../static/uploadconfig.json';

export default {
    data() {
        return {
            data: null,
        }
    },
    computed: {
        actionUrl() {
            return `${actionUrl.url}/upload-file`;
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
