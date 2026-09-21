<!--
  [课程项目注释]
  文件作用：影像浏览页，初始化 CesiumJS 三维地球，实现底图切换、城市定位和坐标显示。
  引用知识：Vue 生命周期与 watch、CesiumJS Viewer、ImageryProvider、相机 flyTo、屏幕空间事件。
  参考资料：Vue 2 官方文档、CesiumJS 官方 Quickstart/API 文档、CesiumJS 中文网、高德开放平台。
  
-->
<template>
  <div class="imagery-view">
    <div class="page-heading">
      <div>
        <div class="eyebrow">3D EARTH · IMAGERY BROWSER</div>
        <h1>影像浏览</h1>
      </div>
      <p>在三维地球上寻找城市、观察影像与底图，并用坐标和图层控制理解空间位置。</p>
    </div>

    <div class="imagery-layout">
      <aside class="control-panel glass-panel">
        <div class="control-heading"><span>浏览控制台</span><span class="live-dot">DEMO</span></div>
        <div class="control-section">
          <label class="control-label">底图类型</label>
          <el-radio-group v-model="baseLayer" size="small" class="layer-radio">
            <el-radio-button label="satellite">卫星影像</el-radio-button>
            <el-radio-button label="street">街道地图</el-radio-button>
          </el-radio-group>
        </div>
        <div class="control-section">
          <label class="control-label">快速定位</label>
          <el-select v-model="selectedCity" placeholder="请选择城市" @change="flyToCity">
            <el-option v-for="city in cities" :key="city.name" :label="city.name + ' · ' + city.description"
              :value="city.name"></el-option>
          </el-select>
        </div>
        <div class="control-section">
          <label class="control-label">演示观测日期</label>
          <el-date-picker v-model="selectedDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
            style="width: 100%"></el-date-picker>
          <p class="control-hint">日期仅用于展示筛选交互，不加载真实历史影像。</p>
        </div>
        <div class="control-footer"><span class="data-note">演示数据</span><span>底图：高德地图</span></div>
      </aside>

      <section class="map-panel glass-panel">
        <div class="map-toolbar">
          <div class="map-title"><span class="map-signal"></span>
            <div><strong>全球影像视图</strong><small>拖动旋转 · 滚轮缩放 · 右键倾斜</small></div>
          </div>
          <div class="map-actions"><span class="map-status" :class="{ ready: cesiumReady }"> cesiumReady ? 'Cesium
              已就绪正在初始化' </span><el-button size="mini" icon="el-icon-refresh" @click="resetView">重置视角</el-button>
          </div>
        </div>
        <div class="cesium-wrap">
          <div ref="cesiumContainer" class="cesium-container"></div>
          <div v-if="!cesiumReady" class="map-overlay"><span
              class="loader-ring"></span><strong>正在初始化三维地球</strong><small>首次加载需要下载地图瓦片</small></div>
          <div v-if="cesiumError" class="map-overlay error-overlay"><i
              class="el-icon-warning-outline"></i><strong>三维地球加载失败</strong><small>{{ cesiumError }}</small><small>请检查
              Cesium 资源文件是否已构建。</small></div>
        </div>
        <div class="coordinate-strip"><span><i class="el-icon-location-outline"></i>鼠标位置</span><strong>{{
          coordinates.longitude }}°E</strong><strong>{{ coordinates.latitude }}°N</strong><span
            class="coordinate-date">观测日期：{{ selectedDate || '未选择' }}</span></div>
      </section>
    </div>

    <div class="imagery-notes">
      <div class="mini-note glass-panel"><i class="el-icon-zoom-in"></i>
        <div><strong>缩放与旋转</strong><span>使用鼠标完成地球漫游</span></div>
      </div>
      <div class="mini-note glass-panel"><i class="el-icon-picture-outline"></i>
        <div><strong>底图切换</strong><span>对比影像与道路信息</span></div>
      </div>
      <div class="mini-note glass-panel"><i class="el-icon-data-line"></i>
        <div><strong>坐标读数</strong><span>实时显示鼠标所在位置</span></div>
      </div>
    </div>
  </div>
</template>

<script>
// 高德卫星影像瓦片地址。{s}、{x}、{y}、{z} 会由 Cesium 自动替换。
const SATELLITE_URL = 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
// 高德街道地图瓦片地址，用于和卫星影像底图进行切换对比。
const STREET_URL = 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'

export default {
  name: 'ImageryView',
  data() {
    return {
      // 控制面板状态：底图类型、当前城市和演示日期。
      baseLayer: 'satellite',
      selectedCity: '北京',
      selectedDate: '2024-06-15',
      cesiumReady: false,
      cesiumError: '',
      // 鼠标所在经纬度，初始值设置在中国中部附近。
      coordinates: { longitude: '104.20', latitude: '35.90' },
      // 保存 Cesium 对象引用，方便在 watch、事件和销毁钩子中复用。
      viewer: null,
      cesium: null,
      satelliteLayer: null,
      streetLayer: null,
      eventHandler: null,
      demoEntities: [],
      // 课程演示用的快速定位城市，包含经纬度、观察高度和区域说明。
      cities: [
        { name: '北京', lng: 116.4074, lat: 39.9042, altitude: 1800000, description: '华北地区' },
        { name: '上海', lng: 121.4737, lat: 31.2304, altitude: 1550000, description: '华东地区' },
        { name: '广州', lng: 113.2644, lat: 23.1291, altitude: 1650000, description: '华南地区' },
        { name: '三亚', lng: 109.5119, lat: 18.2528, altitude: 1450000, description: '南海区域' }
      ]
    }
  },
  // baseLayer 变化时，重新应用图层显示状态。
  watch: {
    baseLayer() { this.applyLayerState() }
  },
  // DOM 挂载完成后再初始化 Cesium，确保 ref 容器已经存在。
  mounted() { this.$nextTick(this.initCesium) },
  // 离开页面前释放事件监听和 Viewer，避免 WebGL 资源和事件泄漏。
  beforeDestroy() {
    if (this.eventHandler && !this.eventHandler.isDestroyed()) this.eventHandler.destroy()
    if (this.viewer && !this.viewer.isDestroyed()) this.viewer.destroy()
  },
  // 以下方法按“初始化、加载图层、添加标记、绑定交互、控制视角”的顺序组织。
  methods: {
    // 初始化 Cesium Viewer，这是影像浏览页的核心步骤。
    initCesium() {
      // Cesium 由 public/index.html 以全局脚本方式加载。
      if (!window.Cesium) {
        this.cesiumError = '未找到 Cesium 运行库。'
        return
      }
      // 使用 try/catch 捕获 WebGL、资源路径或瓦片服务异常，并显示给用户。
      try {
        const Cesium = window.Cesium
        this.cesium = Cesium
        // 关闭默认工具栏和底图选择器，只保留自定义控制面板，页面更简洁。
        const viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          baseLayer: false,
          skyBox: false,
          skyAtmosphere: false,
          shouldAnimate: false
        })
        // 移除 Cesium 默认图层，改为下面两个高德图层。
        if (viewer.imageryLayers) viewer.imageryLayers.removeAll()
        if (viewer.cesiumWidget && viewer.cesiumWidget.creditContainer) viewer.cesiumWidget.creditContainer.style.display = 'none'
        // 设置地球和场景背景，使其与全站深色主题保持一致。
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#e8e8e8')
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#d9d9d9')
        this.viewer = viewer
        // 依次完成图层、城市标记、鼠标坐标、初始视角和状态更新。
        this.addImageryLayers(Cesium)
        this.addDemoMarkers(Cesium)
        this.bindMouseMove(Cesium)
        this.applyLayerState()
        this.resetView()
        // 只有前面步骤全部成功后才显示“Cesium 已就绪”。
        this.cesiumReady = true
      } catch (error) {
        this.cesiumError = error && error.message ? error.message : '初始化异常'
      }
    },
    // 将瓦片 URL 封装为 Cesium 可识别的影像提供器。
    makeProvider(Cesium, url) {
      return new Cesium.UrlTemplateImageryProvider({
        url,
        // 使用多个子域并行加载瓦片，提升地图首次加载速度。
        subdomains: ['1', '2', '3', '4'],
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18,
        credit: '高德地图（课程演示用底图）'
      })
    },
    // 创建卫星影像和街道地图两个图层，并默认显示卫星影像。
    addImageryLayers(Cesium) {
      this.satelliteLayer = this.viewer.imageryLayers.addImageryProvider(this.makeProvider(Cesium, SATELLITE_URL))
      this.streetLayer = this.viewer.imageryLayers.addImageryProvider(this.makeProvider(Cesium, STREET_URL))
      this.streetLayer.alpha = 1
    },
    // 在四个城市坐标上添加点标记和文字标签，帮助课堂演示快速定位。
    addDemoMarkers(Cesium) {
      this.cities.forEach((city) => {
        const entity = this.viewer.entities.add({
          name: city.name,
          position: Cesium.Cartesian3.fromDegrees(city.lng, city.lat),
          point: { pixelSize: 9, color: Cesium.Color.fromCssColorString('#00e5ff'), outlineColor: Cesium.Color.WHITE, outlineWidth: 2, show: true },
          label: { text: city.name, font: '13px Microsoft YaHei', fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.fromCssColorString('#03111d'), outlineWidth: 3, pixelOffset: new Cesium.Cartesian2(0, -22), show: true }
        })
        this.demoEntities.push(entity)
      })
    },
    // 监听鼠标移动，把屏幕坐标转换成地球表面的经纬度。
    bindMouseMove(Cesium) {
      this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      this.eventHandler.setInputAction((movement) => {
        const cartesian = this.viewer.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid)
        if (!cartesian) return
        // Cartesian 转 Cartographic 后，再把弧度转换为度数并保留两位小数。
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        this.coordinates = {
          longitude: Cesium.Math.toDegrees(cartographic.longitude).toFixed(2),
          latitude: Cesium.Math.toDegrees(cartographic.latitude).toFixed(2)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    // 根据底图单选按钮，切换卫星影像和街道地图。
    applyLayerState() {
      if (!this.satelliteLayer || !this.streetLayer) return
      const isSatellite = this.baseLayer === 'satellite'
      this.satelliteLayer.show = isSatellite
      this.streetLayer.show = !isSatellite
    },
    // 根据城市名称查找坐标，让 Cesium 摄像机平滑飞向目标城市。
    flyToCity(name) {
      const city = this.cities.find((item) => item.name === name)
      if (!city || !this.viewer) return
      this.viewer.camera.flyTo({ destination: this.cesium.Cartesian3.fromDegrees(city.lng, city.lat, city.altitude), duration: 1.4 })
    },
    // 重置到能够观察中国区域的默认视角。
    resetView() {
      if (!this.viewer) return
      this.viewer.camera.flyTo({ destination: this.cesium.Cartesian3.fromDegrees(104.2, 35.9, 12000000), duration: 1.2 })
    }
  }
}
</script>

<style scoped>
.imagery-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.imagery-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
}

.control-panel {
  display: flex;
  flex-direction: column;
  padding: 22px;
}

.control-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 19px;
  border-bottom: 1px solid rgba(0, 229, 255, .13);
  font-size: 16px;
  font-weight: 700;
}

.live-dot {
  color: #00e5ff;
  font-size: 10px;
  letter-spacing: .15em;
}

.live-dot::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 10px currentColor;
}

.control-section {
  padding: 21px 0 2px;
}

.control-label {
  display: block;
  margin-bottom: 10px;
  color: #8aa9bf;
  font-size: 12px;
}

.layer-radio {
  display: flex;
  width: 100%;
}

.layer-radio .el-radio-button {
  flex: 1;
}

.layer-radio .el-radio-button__inner {
  width: 100%;
  padding: 9px 8px;
  font-size: 12px;
}

.control-hint {
  margin: 10px 0 0;
  color: #58768d;
  font-size: 11px;
  line-height: 1.65;
}

.control-footer {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 30px;
  color: #638095;
  font-size: 11px;
}

.control-footer .data-note {
  color: #ffbf69;
}

.map-panel {
  min-width: 0;
  overflow: hidden;
}

.map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 67px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(0, 229, 255, .12);
}

.map-title {
  display: flex;
  align-items: center;
  gap: 11px;
}

.map-title strong,
.map-title small {
  display: block;
}

.map-title strong {
  color: #eaf6ff;
  font-size: 14px;
}

.map-title small {
  margin-top: 4px;
  color: #638095;
  font-size: 11px;
}

.map-signal {
  position: relative;
  width: 10px;
  height: 10px;
  border: 1px solid #00e5ff;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(0, 229, 255, .8);
}

.map-signal::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: #00e5ff;
}

.map-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.map-status {
  color: #7898ae;
  font-size: 11px;
}

.map-status.ready {
  color: #2dd4bf;
}

.cesium-wrap {
  position: relative;
  min-height: 660px;
  background: #030b16;
}

.cesium-container {
  position: absolute;
  inset: 0;
}

.map-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  color: #dffcff;
  background: rgba(3, 12, 24, .78);
}

.map-overlay strong {
  font-size: 15px;
}

.map-overlay small {
  color: #7898ae;
  font-size: 11px;
}

.loader-ring {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0, 229, 255, .2);
  border-top-color: #00e5ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-overlay {
  color: #ffb3bf;
}

.error-overlay i {
  color: #ff6b81;
  font-size: 28px;
}

.coordinate-strip {
  display: flex;
  align-items: center;
  gap: 17px;
  min-height: 48px;
  padding: 0 18px;
  color: #7fa0b6;
  font-size: 12px;
}

.coordinate-strip strong {
  color: #00e5ff;
  font-family: Consolas, monospace;
  font-weight: 500;
}

.coordinate-strip i {
  margin-right: 5px;
  color: #66c8ff;
}

.coordinate-date {
  margin-left: auto;
  color: #6f8ca1;
}

.imagery-notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.mini-note {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px 19px;
}

.mini-note>i {
  color: #00e5ff;
  font-size: 22px;
}

.mini-note strong,
.mini-note span {
  display: block;
}

.mini-note strong {
  font-size: 13px;
}

.mini-note span {
  margin-top: 4px;
  color: #7692a7;
  font-size: 11px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .imagery-layout {
    grid-template-columns: 1fr;
  }

  .control-panel {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 24px;
  }

  .control-heading,
  .control-footer {
    grid-column: 1 / -1;
  }

  .control-footer {
    margin-top: 0;
  }

  .cesium-wrap {
    min-height: 540px;
  }
}

@media (max-width: 560px) {
  .control-panel {
    display: flex;
    padding: 18px;
  }

  .map-toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
  }

  .map-actions {
    width: 100%;
    justify-content: space-between;
  }

  .cesium-wrap {
    min-height: 460px;
  }

  .coordinate-strip {
    flex-wrap: wrap;
    gap: 9px;
    padding: 10px 14px;
  }

  .coordinate-date {
    width: 100%;
    margin-left: 0;
  }

  .imagery-notes {
    grid-template-columns: 1fr;
  }
}
</style>