<!--
  [文件说明]
  文件作用：页面底部说明栏。
  样式说明：与纯白页面保持一致，使用深色文字和浅灰边框。
-->
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <strong>星瞳</strong>
        <span>修改版可视化浏览平台</span>
      </div>
      <p>课程实践项目 · 页面数据仅用于卫星信息展示</p>
      <p>Vue · Cesium · satellite.js</p>
    </div>
  </footer>
</template>

<script>
export default { name: 'AppFooter' }
</script>

<style scoped>
.site-footer {
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: min(1440px, calc(100% - 48px));
  min-height: 76px;
  margin: 0 auto;
  color: #667085;
  font-size: 12px;
}

.footer-brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.footer-brand strong {
  color: #111827;
  font-size: 18px;
  letter-spacing: .14em;
}

.footer-inner p {
  margin: 0;
}

@media (max-width: 760px) {
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
    width: calc(100% - 28px);
    padding: 20px 0;
  }
}
</style>