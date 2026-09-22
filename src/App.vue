<!--
  [文件说明]
  文件作用：Vue 根组件，负责组合顶部栏、当前路由页面和底部栏。
-->
<template>
  <div id="app">
    <!-- 纯白页面背景。 -->
    <div class="space-bg" aria-hidden="true"></div>
    <app-header />
    <main class="page-shell">
      <!-- Vue Router 根据地址显示 VisualizeView。 -->
      <router-view />
    </main>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  // 根组件只管理公共布局，业务数据放在页面组件中。
  components: { AppHeader, AppFooter }
}
</script>