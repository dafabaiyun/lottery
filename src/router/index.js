/*
 * @Author: army liu
 * @Date: 2020-08-31 22:55:46
 * @LastEditors: army liu
 * @LastEditTime: 2020-11-02 22:15:55
 * @FilePath: \lottery\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import mainContent from '@/components/maincontent'
import look from "@/components/look"
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainContent',
      component: mainContent
    },{
      path:'/look',
      name:'look',
      component:look
    }
  ]
})
