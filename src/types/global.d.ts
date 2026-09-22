/**
 * [类型声明]
 * 文件作用：补充 VS Code 需要的全局类型和 Vue 2 类型增强。
 * 注意：这些声明只影响编辑器智能提示，不改变浏览器运行逻辑。
 */

declare global {
  interface Window {
    // Cesium 由 public/index.html 中的本地脚本加载到 window 对象。
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