<template>
    <div class="sidebar" :class="{'expand': isExpand}">
        <ul class="menu-list">
            <li class="menu-item" :class="{'active': activeItem === 'excelFilter'}" @click="select('excelFilter')">
                <Icon type="document-text"></Icon>
                <span v-show="isExpand">表格管理</span>
            </li>
            <li class="menu-item" :class="{'active': activeItem === 'docFilter'}" @click="select('docFilter')">
                <Icon type="document-text"></Icon>
                <span v-show="isExpand">文档管理</span>
            </li>
            <li class="menu-item" :class="{'active': activeItem === 'other'}" @click="select('other')">
                <Icon type="heart-broken"></Icon>
                <span v-show="isExpand">待开发</span>
            </li>
        </ul>
        <Button class="back" @click="toggleSide">
            <Icon v-if="isExpand" type="chevron-left"></Icon>
            <Icon v-else type="chevron-right"></Icon>
        </Button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isExpand: true,
            sidebarState: 'expand',
            activeItem: '',
        }
    },
    methods: {
        select(MenuItem) {
            this.activeItem = MenuItem;
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
        },
        toggleSide() {
            this.isExpand = !this.isExpand;
            this.$store.commit('setExpand', this.isExpand);
        }
    }
}
</script>


<style lang="scss">
    .sidebar {
        position: relative;
        height: 100%;
        width: 60px;
        background: #2b333d;
        overflow: hidden;
        transition: width 0.3s linear;
        &.expand {
            width: 230px;
        }
        .menu-list {
            width: 100%;
            height: 100%;
            .menu-item {
                padding: 7px 24px;
                font-size: 14px;
                line-height: 24px;
                color: #c5d0de;
                overflow: hidden;
                white-space: nowrap;
                cursor: pointer;
                span {
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                }
                &:hover, &.active {
                    color: #fff;
                    background: #24272D;
                }
                .ivu-icon {
                    margin-right: 13px;
                }
            }
        }
        .back {
            position: absolute;
            z-index: 1000;
            bottom: 0;
            width: 100%;
            border: 0;
            border-radius: 0;
            background-color: rgba(225,225,225,.3);
        }
    }
</style>
