<template>
    <div class="sidebar" :class="{'expand': isExpand}">
        <div class="header-logo">
            <a id="logo">
                <svg width="36" height="36" id="tanuki-logo">
                    <path id="tanuki-right-ear" class="tanuki-shape" fill="#e24329" d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"></path>
                    <path id="tanuki-left-ear" class="tanuki-shape" fill="#e24329" d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"></path>
                    <path id="tanuki-nose" class="tanuki-shape" fill="#e24329" d="M18,34.38 3,14 33,14 Z"></path>
                    <path id="tanuki-right-eye" class="tanuki-shape" fill="#fc6d26" d="M18,34.38 11.38,14 2,14 6,25Z"></path>
                    <path id="tanuki-left-eye" class="tanuki-shape" fill="#fc6d26" d="M18,34.38 24.62,14 34,14 30,25Z"></path>
                    <path id="tanuki-right-cheek" class="tanuki-shape" fill="#fca326" d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"></path>
                    <path id="tanuki-left-cheek" class="tanuki-shape" fill="#fca326" d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"></path>
                </svg>
            </a>
            <span class="slogen">Sword</span>
        </div>
        <ul class="menu-list">
            <li class="menu-item" :class="{'active': activeItem === '/excel-filter'}" @click="select('excelFilter')">
                <Icon type="document-text"></Icon>
                <span v-show="isExpand">表格管理</span>
            </li>
            <li class="menu-item" :class="{'active': activeItem === '/doc-filter'}" @click="select('docFilter')">
                <Icon type="document-text"></Icon>
                <span v-show="isExpand">文档管理</span>
            </li>
            <li class="menu-item" :class="{'active': activeItem === '/'}" @click="select('other')">
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
        }
    },
    computed: {
        activeItem() {
            return this.$route.path;
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
        .header-logo {
            display: flex;
            align-items: center;
            width: 100%;
            height: 60px;
            padding: 11px 0 11px 22px;
            #logo {
                cursor: pointer;
            }
            .slogen {
                font-size: 19px;
                color: #c5d0de;
                margin-left: 16px;
            }
        }
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
