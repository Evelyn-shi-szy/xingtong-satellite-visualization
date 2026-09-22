import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VisualizeView from '../views/VisualizeView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: '首页' } },
  { path: '/visualize', name: 'visualize', component: VisualizeView, meta: { title: '卫星可视化' } },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '首页'} | 星瞳`
})

export default router