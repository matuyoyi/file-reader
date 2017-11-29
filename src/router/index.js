import Vue from 'vue'
import Router from 'vue-router'
import excelFilter from '@/components/excelFilter.vue'
import workbench from '@/components/workbench.vue'
import testPage from '@/components/testPage.vue'
import docFilter from '@/components/fileManage/docFilter.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'workbench',
            component: workbench,
            children: [
                { path: '/', component: testPage },
                { path: 'excel-filter', component: excelFilter },
                { path: 'doc-filter', component: docFilter }
            ]
        }
    ]
})
