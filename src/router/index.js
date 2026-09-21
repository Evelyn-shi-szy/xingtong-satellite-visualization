
import Vue from 'vue'
import VueRouter from 'vue-router'

import ImageryView from '../views/ImageryView.vue'
import SatelliteView from '../views/SatelliteView.vue'

// 安装 Vue Router 插件，之后组件可以通过 router-link 和 this.$router 使用路由功能。
Vue.use(VueRouter)

// 路由表：每个路由对应一个页面组件，meta.title 用于切换浏览器标题。
const routes = [
  // 默认进入影像浏览页。
  { path: '/', redirect: '/imagery' },
  { path: '/imagery', name: 'imagery', component: ImageryView, meta: { title: '影像浏览' } },
  { path: '/satellite', name: 'satellite', component: SatelliteView, meta: { title: '卫星信息' } },
  // 输入未知地址时也回到影像浏览页，避免出现空白页面。
  { path: '*', redirect: '/imagery' }
]

const router = new VueRouter({
  // 课程演示使用 hash 模式，部署到普通静态服务器时更容易直接打开。
  mode: 'hash',
  routes,
  // 每次切换页面时回到顶部，符合单页应用常见的浏览习惯。
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

// 路由切换完成后更新页面标题，让浏览器标签页显示当前页面名称。
router.afterEach((to) => {
  document.title = `${to.meta.title || '影像浏览'} | 星瞳`
})

export default router
