<!--
  [课程项目注释]
  文件作用：展示项目名称、技术栈和课程演示数据声明。
  引用知识：Vue 单文件组件、语义化 HTML、Flex 布局和响应式 CSS。
  参考资料：Vue 2 官方文档、MDN HTML/CSS。
-->
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div><strong>星瞳</strong><span>卫星影像可视化浏览平台</span></div>
      <p>课程设计 Demo · 统计数据与卫星指标仅用于演示</p>
      <p>Vue 2 · Element UI · CesiumJS</p>
    </div>
  </footer>
</template>

<script>
// 页脚只展示静态说明，不参与业务交互，适合作为独立布局组件。
</script>

<style scoped>
.site-footer { border-top: 1px solid rgba(0, 229, 255, .1); background: rgba(3, 9, 18, .72); }
.footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; width: min(1440px, calc(100% - 48px)); min-height: 92px; margin: 0 auto; color: #6f8aa0; font-size: 12px; }
.footer-inner div { display: flex; align-items: baseline; gap: 10px; }
.footer-inner strong { color: #dffcff; font-size: 18px; letter-spacing: .14em; }
.footer-inner p { margin: 0; }
@media (max-width: 760px) { .footer-inner { align-items: flex-start; flex-direction: column; width: calc(100% - 28px); padding: 24px 0; } .footer-inner div { align-items: flex-start; flex-direction: column; gap: 3px; } }
</style>