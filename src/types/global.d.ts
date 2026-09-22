/**
 * [类型声明]
 * 文件作用：补充编辑器需要的全局类型和 Vue 2 类型增强。
 * 注意：这些声明只影响 VS Code 的智能提示，不改变浏览器运行逻辑。
 */

declare global {
  interface Window {
    // Cesium 通过 public/index.html 中的 <script> 加载到 window 对象。
    Cesium: any
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    // Vue Router 会在运行时自动注入这两个属性。
    $router: any
    $route: any
  }
}

export {}