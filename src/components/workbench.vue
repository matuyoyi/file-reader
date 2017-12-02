<template>
    <div class="workbench">
        <sidebar></sidebar>
        <div class="main" :class="{'isExpand': isExpand}">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import navbar from './navbar.vue'
import sidebar from './sidebar.vue'

export default {
    data() {
        return {

        }
    },
    computed: {
        isExpand() {
            return this.$store.state.workbench.isExpand;
        }
    },
    components: {
        navbar,
        sidebar
    }
}
</script>

<style lang="scss">
.workbench {
    width: 100%;
    height: 100%;
    display: flex;
    .main {
        width: calc(100% - 60px);
        height: 100%;
        &.isExpand {
            width: calc(100% - 230px);
        }
    }
}
</style>

