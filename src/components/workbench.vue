<template>
    <div class="workbench">
        <navbar></navbar>
        <div class="wrapper">
            <sidebar></sidebar>
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
    components: {
        navbar,
        sidebar
    }
}
</script>

<style lang="scss">
$navH: 60px;
.workbench {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .wrapper {
        display: flex;
        width: 100%;
        height: calc(100% - $navH);
    }
}
</style>

