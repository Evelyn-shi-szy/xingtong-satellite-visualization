

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import './assets/styles/theme.css'

Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

// 创建 Vue 2 根实例，注入路由，并把 App 组件渲染到 public/index.html 的 #app 节点。
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')