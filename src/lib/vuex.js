import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import workbench from '../store/workbench';

const store = new Vuex.Store({
    modules: {
        workbench,
    }
});

const STORE = store;
export default STORE;
