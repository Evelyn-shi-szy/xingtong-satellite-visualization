# 星瞳——卫星可视化浏览平台

该项目使用 Vue、Cesium 和 satellite.js 完成四颗卫星的位置与轨道可视化。

## 页面逻辑

1. `src/data/satellites.js` 保存四颗卫星的基础资料和 TLE 两行根数。
2. `src/views/VisualizeView.vue` 使用 `satellite.twoline2satrec()` 解析 TLE。
3. 使用 `satellite.propagate()`、`satellite.gstime()` 和 `satellite.eciToGeodetic()` 计算卫星当前位置。
4. 使用 Cesium 在三维地球中显示四颗卫星的位置。
5. 点击卫星或左侧列表后，显示该卫星的当前位置和一条完整轨道。
6. 页面背景为纯白色，信息面板采用深色文字和浅色边框。
7. 页面不会显示 TLE 第一行或 TLE 第二行的具体文字。

## 本地运行

```bash
npm install
npm run serve
```

## 项目特点

- Vue 2 基础数据绑定、列表渲染、条件渲染和生命周期
- JavaScript 数组、对象、函数和点击事件
- satellite.js TLE 解析和卫星位置计算
- Cesium 三维地球、卫星点和 polyline 轨道线
- 鼠标拖动旋转、滚轮缩放

## 数据说明

TLE 数据用于课程演示，不代表实时遥测数据。