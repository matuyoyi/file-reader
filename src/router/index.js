import Vue from 'vue'
import Router from 'vue-router'
import fileFilter from '@/components/fileFilter.vue'
import workbench from '@/components/workbench.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'workbench',
            component: workbench,
            children: [
                { path: 'file-filter', component: fileFilter }
            ]
        }
    ]
})
