/**
 * [文件说明]
 * 文件作用：配置页面路由。
 * 当前项目只有一个核心页面：卫星可视化页面。
 * 学习重点：Vue Router 3 的 routes、redirect、hash 模式和 afterEach。
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VisualizeView from '../views/VisualizeView.vue'

// 安装 Vue Router 插件。
Vue.use(VueRouter)

// 根地址和未知地址都跳转到卫星可视化页面，避免出现空白页面。
const routes = [
  { path: '/', redirect: '/visualize' },
  {
    path: '/visualize',
    name: 'visualize',
    component: VisualizeView,
    meta: { title: '卫星可视化' }
  },
  { path: '*', redirect: '/visualize' }
]

const router = new VueRouter({
  // hash 模式适合直接部署到 GitHub Pages 等静态空间。
  mode: 'hash',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

// 每次切换路由后更新浏览器标签页标题。
router.afterEach((to) => {
  document.title = `${to.meta.title || '卫星可视化'} | 星瞳修改版可视化浏览平台`
})

export default router