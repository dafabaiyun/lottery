/*
 * @Author: army liu
 * @Date: 2020-08-31 22:55:46
 * @LastEditors: army liu
 * @LastEditTime: 2020-09-25 22:22:42
 * @FilePath: \lottery\config\dev.env.js
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"//47.101.10.168/lottery"'
})
