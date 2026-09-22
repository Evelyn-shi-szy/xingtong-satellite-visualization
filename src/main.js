/**
 * [文件说明]
 * 文件作用：创建 Vue 根实例，并把路由、根组件和全局样式接入页面。
 * 学习重点：Vue 实例、Vue Router、单文件组件和 CSS 引入方式。
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/theme.css'

// 关闭生产环境提示，让浏览器控制台更简洁。
Vue.config.productionTip = false

// 创建根 Vue 实例，并挂载到 public/index.html 中的 #app 节点。
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')