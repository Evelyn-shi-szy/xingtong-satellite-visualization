# 星瞳——卫星可视化浏览平台（大学生易讲解精简版）

## 页面逻辑
1. `satellites.js` 保存 4 颗卫星的演示数据。
2. `VisualizeView.vue` 使用 `v-for` 把 4 颗卫星全部显示出来。
3. 点击顶部卫星名称，`scrollTo()` 使用 `scrollIntoView()` 滚动到对应卡片。
4. 轨道图只使用 HTML + CSS 绘制，不使用 Cesium、satellite.js、WebGL 或远程 API。
5. CSS `@keyframes` 让小圆点在轨道上做简单往返动画，用于课程可视化演示。

## 本地运行
```bash
npm install
npm run serve
```

## 适合答辩讲解的知识点
- Vue 2：`data`、`v-for`、`:key`、`:style`、`@click`
- JavaScript：数组、对象、函数、`getElementById()`、`scrollIntoView()`
- CSS：Grid/Flex、定位、圆角、媒体查询、`@keyframes` 动画

> 卫星参数为课程演示数据，不代表实时遥测数据。
