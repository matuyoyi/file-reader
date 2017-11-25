<template>
    <div class="sidebar">
        <Tree class="menu-list" :data="treeData"></Tree>
    </div>
</template>

<script>
export default {
    data() {
        return {
            treeData: [
                {
                    title: 'parent 1',
                    expand: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1'
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1'
                                },
                                {
                                    title: 'leaf 1-2-1'
                                }
                            ]
                        }
                    ]
                }
            ]
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
