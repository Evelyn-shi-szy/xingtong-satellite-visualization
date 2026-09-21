<!--
  [课程项目注释]
  文件作用：全站顶部导航，使用 router-link 与 Element UI 菜单切换两个页面。
  引用知识：Vue 组件、Element UI 水平菜单、Vue Router 导航、响应式 CSS。
  参考资料：Vue Router 3 官方文档、Element UI Menu 组件文档、MDN CSS。
-->
<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link to="/imagery" class="brand" aria-label="返回影像浏览页">
        <span class="brand-mark" aria-hidden="true">
          <span class="brand-core"></span>
          <span class="brand-orbit"></span>
          <span class="brand-satellite"></span>
        </span>
        <span>
          <strong>星瞳</strong>
          <small>卫星影像可视化浏览平台</small>
        </span>
      </router-link>

      <!-- Element UI Menu 开启 router 后，index 可以直接对应 Vue Router 路径。 -->
      <el-menu class="main-menu" mode="horizontal" router>
        <el-menu-item index="/imagery">影像浏览</el-menu-item>
        <el-menu-item index="/satellite">卫星信息</el-menu-item>
      </el-menu>
    </div>
  </header>
</template>

<script>
// 导航状态主要由 Vue Router 和 Element UI 菜单自身维护，因此组件逻辑保持简单。
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid rgba(0, 229, 255, .14);
  background: rgba(4, 13, 24, .82);
  backdrop-filter: blur(16px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1440px, calc(100% - 48px));
  height: 76px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 230px;
}

.brand>span:last-child {
  display: flex;
  flex-direction: column;
}

.brand strong {
  color: #f3fcff;
  font-size: 22px;
  letter-spacing: .18em;
}

.brand small {
  margin-top: 3px;
  color: #6f91aa;
  font-size: 11px;
  letter-spacing: .08em;
}

.brand-mark {
  position: relative;
  display: block;
  width: 42px;
  height: 42px;
}

.brand-core {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #bffbff, #00a8ff 38%, #005c9e 72%);
  box-shadow: 0 0 18px rgba(0, 229, 255, .85);
}

.brand-orbit {
  position: absolute;
  top: 16px;
  left: 1px;
  width: 40px;
  height: 10px;
  border: 1px solid rgba(120, 239, 255, .8);
  border-radius: 50%;
  transform: rotate(-25deg);
}

.brand-satellite {
  position: absolute;
  top: 7px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px #00e5ff;
}

.main-menu.el-menu {
  border-bottom: 0;
  background: transparent;
}

.main-menu .el-menu-item {
  height: 76px;
  padding: 0 20px;
  color: #8da9bf;
  border-bottom: 2px solid transparent;
  font-size: 14px;
}

.main-menu .el-menu-item:hover,
.main-menu .el-menu-item:focus {
  color: #dffcff;
  background: rgba(0, 229, 255, .04);
}

.main-menu .el-menu-item.is-active {
  color: #00e5ff;
  border-bottom-color: #00e5ff;
  background: linear-gradient(to top, rgba(0, 229, 255, .1), transparent 70%);
}

@media (max-width: 900px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    width: calc(100% - 28px);
    height: auto;
    padding-top: 12px;
  }

  .brand {
    min-width: 0;
  }

  .brand small {
    display: none;
  }

  .main-menu.el-menu {
    display: flex;
    width: 100%;
    overflow-x: auto;
  }

  .main-menu .el-menu-item {
    height: 48px;
    flex: 1 0 auto;
    justify-content: center;
    padding: 0 12px;
  }
}
</style>
