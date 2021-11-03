/*
 * @Author: army liu
 * @Date: 2020-08-31 22:55:46
 * @LastEditors: army liu
 * @LastEditTime: 2020-11-02 22:41:23
 * @FilePath: \lottery\src\main.js
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios"
import VueAxios from 'vue-axios'
import 'vant/lib/toast/style';
Vue.use(VueAxios, axios)
import { MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$msgbox = MessageBox
axios.defaults.baseURL = process.env.API_ROOT
import { PullRefresh } from 'vant';

Vue.use(PullRefresh);
// Vue.use(Dialog)
// Vue.use(MessageBox);
Vue.config.productionTip = false
Vue.prototype.$axios = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
