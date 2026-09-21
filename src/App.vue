<!--
  [课程项目注释]
  文件作用：应用根组件，负责组合页头、路由页面和页脚。
  引用知识：Vue 2 单文件组件、组件注册、router-view。
  参考资料：Vue 2 官方文档、Vue Router 3 官方文档。
-->
<template>
  <div id="app">
    <div class="space-bg" aria-hidden="true"></div>
    <app-header />
    <main class="page-shell">
      <router-view />
    </main>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

// 根组件只负责公共布局，不保存业务数据。
export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>
