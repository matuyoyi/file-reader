<template>
    <div class="sidebar">
        <Menu class="menu-list" theme="dark" active-name="" @on-select="select">
            <MenuGroup title="文件管理">
                <MenuItem name="excelFilter">
                    <Icon type="document-text"></Icon>
                    表格管理
                </MenuItem>
                <MenuItem name="docFilter">
                    <Icon type="document-text"></Icon>
                    文档管理
                </MenuItem>
            </MenuGroup>
            <MenuGroup title="统计分析">
                <MenuItem name="3">
                    <Icon type="heart"></Icon>
                    用户留存
                </MenuItem>
                <MenuItem name="4">
                    <Icon type="heart-broken"></Icon>
                    流失用户
                </MenuItem>
            </MenuGroup>
        </Menu>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        select(MenuItem) {
            switch(MenuItem) {
            case 'excelFilter':
                this.$router.push('excel-filter')
                break;
            case 'docFilter':
                this.$router.push('doc-filter')
                break;
            default:
                this.$router.push('/');
            }
        }
    }
}
</script>


<style lang="scss">
    .sidebar {
        width: 250px;
        height: 100%;
        .menu-list {
            height: 100%;
        }
    }
</style>
