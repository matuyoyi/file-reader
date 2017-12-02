// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import 'lodash';
import STORE from './lib/vuex';

Vue.config.productionTip = false;

Vue.use(iView);
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: STORE,
  template: '<App/>',
  components: { App }
})
