/**
 * [文件说明]
 * Vue CLI 构建配置。
 * 一方面保留生产环境子路径，另一方面把 Cesium 运行资源复制到 dist/cesium。
 */
const { defineConfig } = require('@vue/cli-service')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  // GitHub Pages 仓库地址对应的生产环境子路径。
  publicPath: process.env.NODE_ENV === 'production' ? '/xingtong-satellite-visualization/' : '/',
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium'),
            to: 'cesium',
            globOptions: { ignore: ['**/*.map'] }
          }
        ]
      })
    ]
  }
})