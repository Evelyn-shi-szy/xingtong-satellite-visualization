import Vue from 'vue'
import VueRouter from 'vue-router'
import VisualizeView from '../views/VisualizeView.vue'

Vue.use(VueRouter)

// 全站只保留卫星可视化页面，根地址自动进入该页面。
const routes = [
  { path: '/', redirect: '/visualize' },
  { path: '/visualize', name: 'visualize', component: VisualizeView, meta: { title: '卫星可视化' } },
  { path: '*', redirect: '/visualize' }
]

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '卫星可视化'} | 星瞳`
})

export default router