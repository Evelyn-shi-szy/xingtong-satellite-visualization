<!--
  [文件说明]
  文件作用：页面底部说明栏，展示项目名称、数据说明和技术栈。
-->
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <strong>星瞳</strong>
        <span>修改版可视化浏览平台</span>
      </div>
      <p>课程实践项目 · 页面数据仅用于卫星信息展示</p>
      <p>Vue · HTML · CSS</p>
    </div>
  </footer>
</template>

<script>
// 页脚只展示静态说明，因此不需要业务逻辑。
export default { name: 'AppFooter' }
</script>

<style scoped>
.site-footer {
  border-top: 1px solid rgba(98, 243, 255, .1);
  background: rgba(2, 7, 15, .82);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: min(1440px, calc(100% - 48px));
  min-height: 76px;
  margin: 0 auto;
  color: #6f8aa0;
  font-size: 12px;
}

.footer-brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.footer-brand strong {
  color: #dffcff;
  font-size: 18px;
  letter-spacing: .14em;
}

.footer-inner p {
  margin: 0;
}

@media (max-width: 760px) {
  /* 小屏幕下页脚改为纵向排列，避免文字拥挤。 */
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
    width: calc(100% - 28px);
    padding: 20px 0;
  }
}
</style>