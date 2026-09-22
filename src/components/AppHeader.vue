<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link to="/" class="brand" aria-label="星瞳首页">
        <span class="brand-mark" aria-hidden="true">
          <span class="brand-core"></span>
          <span class="brand-orbit"></span>
          <span class="brand-satellite"></span>
        </span>
        <span class="brand-text">
          <strong>星瞳</strong>
          <small>卫星可视化浏览平台</small>
        </span>
      </router-link>

      <nav class="main-nav" aria-label="主导航">
        <router-link to="/">首页</router-link>
        <router-link to="/visualize">卫星可视化</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default { name: 'AppHeader' }
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid rgba(98, 243, 255, .14);
  background: rgba(3, 10, 20, .86);
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
  background: radial-gradient(circle at 35% 30%, #d5fdff, #22b8e6 45%, #075b8e 75%);
  box-shadow: 0 0 18px rgba(98, 243, 255, .7);
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
  background: #ffffff;
  box-shadow: 0 0 10px #62f3ff;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-text strong {
  color: #f3fcff;
  font-size: 22px;
  letter-spacing: .18em;
}

.brand-text small {
  margin-top: 3px;
  color: #6f91aa;
  font-size: 11px;
  letter-spacing: .08em;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-nav a {
  position: relative;
  padding: 27px 18px 26px;
  color: #8da9bf;
  font-size: 14px;
}

.main-nav a::after {
  content: "";
  position: absolute;
  right: 18px;
  bottom: 0;
  left: 18px;
  height: 2px;
  background: transparent;
}

.main-nav a:hover,
.main-nav a.router-link-exact-active {
  color: #62f3ff;
}

.main-nav a.router-link-exact-active::after {
  background: #62f3ff;
  box-shadow: 0 0 10px rgba(98, 243, 255, .6);
}

@media (max-width: 720px) {
  .header-inner {
    width: calc(100% - 28px);
    height: 66px;
  }

  .brand-text small {
    display: none;
  }

  .main-nav a {
    padding: 22px 10px 21px;
  }
}
</style>