/**
 * [类型声明]
 * 文件作用：让 VS Code/Volar 正确识别 .vue 单文件组件。
 * 没有这个声明时，import App from './App.vue' 可能显示红色波浪线。
 */
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}