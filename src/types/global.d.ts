/**
 * [类型声明]
 * 文件作用：补充 VS Code 需要的 Vue 2 类型增强。
 * 注意：这些声明只影响编辑器智能提示，不改变浏览器运行逻辑。
 */

declare module 'vue/types/vue' {
  interface Vue {
    // Vue Router 会在运行时自动注入这两个属性。
    $router: any
    $route: any
  }
}

export {}