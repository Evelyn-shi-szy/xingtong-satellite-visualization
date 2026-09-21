/**
 * [课程项目注释]
 * 文件作用：Vue CLI 构建配置，将 CesiumJS 运行资源复制到 dist/cesium。
 * 引用知识：Vue CLI 配置、Webpack 构建、CopyWebpackPlugin、Node.js path 模块。
 * 参考资料：Vue CLI 官方配置文档、CopyWebpackPlugin 文档。
 */
const { defineConfig } = require('@vue/cli-service')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = defineConfig({
  // GitHub Pages 项目站点位于子路径，使用相对路径避免 JS/CSS/图片 404。
  publicPath: './',
  // 依赖包也参与 Babel 转译，减少旧浏览器兼容问题。
  transpileDependencies: true,
  // 课程作业不需要发布 source map，可减小生产构建体积。
  productionSourceMap: false,
  configureWebpack: {
    performance: { hints: false },
    plugins: [
      // CesiumJS 运行时需要 Workers、Assets、Widgets 等静态资源。
      // 因此构建时把 node_modules/cesium/Build/Cesium 复制到 dist/cesium。
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium'),
            to: 'cesium',
            globOptions: {
              // 不复制体积较大的 source map，避免 dist 过大。
              ignore: ['**/*.map']
            }
          }
        ]
      })
    ]
  }
})
