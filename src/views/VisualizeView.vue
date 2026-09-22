<template>
  <div class="visualize-view">
    <div class="visualize-heading">
      <div>
        <span class="eyebrow">3D SATELLITE VIEW · REAL-TIME POSITION</span>
        <h1>卫星可视化</h1>
        <p>点击三维场景中的卫星点，或使用左侧列表选择卫星；页面会显示它的信息和一条完整轨道。</p>
      </div>
    </div>

    <div class="visualize-layout">
      <aside class="control-panel">
        <div class="panel-heading">
          <div><strong>卫星列表</strong><small>{{ satellites.length }} 个本地对象</small></div>
          <span class="panel-live"><i></i>REAL-TIME</span>
        </div>

        <div class="satellite-switcher">
          <button
            v-for="satellite in satellites"
            :key="satellite.id"
            type="button"
            :class="{ active: satellite.id === selectedId }"
            @click="selectSatellite(satellite.id)"
          >
            <span class="satellite-dot" :style="{ background: satellite.color, boxShadow: `0 0 14px ${satellite.color}` }"></span>
            <span class="switcher-copy"><strong>{{ satellite.name }}</strong><small>{{ satellite.shortName }} · {{ satellite.type }}</small></span>
            <span class="switcher-arrow">→</span>
          </button>
        </div>

        <div v-if="selectedSatellite" class="info-card">
          <div class="info-title">
            <span class="info-code">{{ selectedSatellite.shortName }}</span>
            <span class="info-type">{{ selectedSatellite.type }}</span>
          </div>
          <h2>{{ selectedSatellite.name }}</h2>
          <p>{{ selectedSatellite.description }}</p>

          <div class="coordinate-grid">
            <div><span>当前经度</span><strong>{{ currentPosition.longitude }}</strong></div>
            <div><span>当前纬度</span><strong>{{ currentPosition.latitude }}</strong></div>
            <div><span>轨道高度</span><strong>{{ currentPosition.height }}</strong></div>
          </div>
        </div>
      </aside>

      <section class="map-panel">
        <div class="map-toolbar">
          <div class="map-state">
            <span class="state-dot" :class="{ ready: cesiumReady, error: cesiumError }"></span>
            <div>
              <strong>{{ statusText }}</strong>
              <small>更新时间：{{ lastUpdated }}</small>
            </div>
          </div>
          <div class="map-legend">
            <span><i class="legend-point"></i>卫星位置</span>
            <span><i class="legend-line"></i>当前轨道</span>
          </div>
        </div>

        <div class="cesium-wrap">
          <div ref="cesiumContainer" class="cesium-container"></div>
          <div v-if="!cesiumReady && !cesiumError" class="map-overlay">
            <span class="loader-ring"></span>
            <strong>正在初始化三维地球</strong>
            <small>Cesium 正在准备卫星场景</small>
          </div>
          <div v-if="cesiumError" class="map-overlay error-overlay">
            <strong>三维场景加载失败</strong>
            <small>{{ cesiumError }}</small>
          </div>
          <div class="mouse-tip">拖动旋转 · 滚轮缩放 · 点击卫星查看轨道</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import * as satellite from 'satellite.js'
import satelliteData from '../data/satellites'

export default {
  name: 'VisualizeView',
  data() {
    return {
      // 给每颗卫星增加 satrec，satellite.js 后续使用它计算位置。
      satellites: satelliteData.map((item) => ({
        ...item,
        satrec: satellite.twoline2satrec(item.tle1, item.tle2)
      })),
      selectedId: 1,
      currentPosition: { longitude: '--', latitude: '--', height: '--' },
      viewer: null,
      cesium: null,
      orbitEntity: null,
      mouseHandler: null,
      timer: null,
      satelliteEntities: {},
      hoveredId: null,
      cesiumReady: false,
      cesiumError: '',
      lastUpdated: '等待计算'
    }
  },
  computed: {
    selectedSatellite() {
      return this.satellites.find((item) => item.id === this.selectedId) || null
    },
    statusText() {
      if (this.cesiumError) return '场景加载失败'
      return this.cesiumReady ? '卫星场景已就绪' : '正在初始化'
    }
  },
  mounted() {
    // 首页卡片可以携带 satellite 参数，进入页面后直接选中对应卫星。
    const queryId = Number(this.$route.query.satellite)
    if (this.satellites.some((item) => item.id === queryId)) this.selectedId = queryId
    this.$nextTick(this.initCesium)
  },
  beforeDestroy() {
    if (this.timer) window.clearInterval(this.timer)
    if (this.mouseHandler && !this.mouseHandler.isDestroyed()) this.mouseHandler.destroy()
    window.removeEventListener('resize', this.resizeViewer)
    if (this.viewer && !this.viewer.isDestroyed()) this.viewer.destroy()
  },
  methods: {
    // 初始化 Cesium 场景。输入：无；输出：可交互的三维地球。
    initCesium() {
      const Cesium = window.Cesium
      if (!Cesium) {
        this.cesiumError = '没有读取到本地 Cesium 运行库'
        return
      }

      try {
        this.cesium = Cesium
        const viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
          animation: false,
          timeline: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          baseLayer: false,
          skyBox: false,
          skyAtmosphere: false,
          shouldAnimate: true
        })

        // 隐藏 Cesium 默认版权容器，使用深蓝色无底图地球突出卫星与轨道。
        if (viewer.cesiumWidget && viewer.cesiumWidget.creditContainer) {
          viewer.cesiumWidget.creditContainer.style.display = 'none'
        }
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#01050d')
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a2943')
        viewer.scene.globe.showGroundAtmosphere = true
        // 使用 Cesium 自带的本地网格图层，不访问在线地图，也能清楚看到地球表面。
        viewer.imageryLayers.addImageryProvider(new Cesium.GridImageryProvider({
          color: Cesium.Color.fromCssColorString('#8deaf4').withAlpha(0.24),
          glowColor: Cesium.Color.fromCssColorString('#3e9cc4').withAlpha(0.08),
          backgroundColor: Cesium.Color.fromCssColorString('#09283d'),
          cells: 6
        }))
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(105, 30, 19000000),
          orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 }
        })

        this.viewer = viewer
        this.addSatelliteEntities()
        this.updateEntityStyles()
        this.refreshPositions()
        this.drawOrbit(this.selectedSatellite)
        this.bindMouseEvents()
        window.addEventListener('resize', this.resizeViewer)
        this.timer = window.setInterval(this.refreshPositions, 1000)
        this.cesiumReady = true
      } catch (error) {
        this.cesiumError = error && error.message ? error.message : '初始化异常'
      }
    },

    // 根据卫星对象和指定时间计算经纬度、高度。输入：卫星对象和时间；输出：位置对象。
    calculatePosition(item, date) {
      const result = satellite.propagate(item.satrec, date)
      if (!result || !result.position) return null

      // ECI 坐标转经纬度时需要使用当前时刻的格林尼治恒星时。
      const gmst = satellite.gstime(date)
      const geodetic = satellite.eciToGeodetic(result.position, gmst)
      const longitude = satellite.radiansToDegrees(geodetic.longitude)
      const latitude = satellite.radiansToDegrees(geodetic.latitude)
      const height = geodetic.height * 1000

      return {
        longitude,
        latitude,
        height,
        cartesian: this.cesium.Cartesian3.fromDegrees(longitude, latitude, height)
      }
    },

    // 创建每颗卫星对应的 Cesium 点与文字标签。
    addSatelliteEntities() {
      const now = new Date()
      this.satellites.forEach((item) => {
        const position = this.calculatePosition(item, now)
        if (!position) return
        const entity = this.viewer.entities.add({
          satelliteId: item.id,
          name: item.name,
          position: position.cartesian,
          point: {
            pixelSize: 11,
            color: this.cesium.Color.fromCssColorString(item.color),
            outlineColor: this.cesium.Color.WHITE,
            outlineWidth: 2
          },
          label: {
            text: item.shortName,
            font: '12px Microsoft YaHei',
            fillColor: this.cesium.Color.WHITE,
            outlineColor: this.cesium.Color.fromCssColorString('#020710'),
            outlineWidth: 3,
            pixelOffset: new this.cesium.Cartesian2(0, -24),
            scale: 1
          }
        })
        this.satelliteEntities[item.id] = entity
      })
    },

    // 刷新所有卫星点，并把选中卫星的经纬度显示到信息区。
    refreshPositions() {
      if (!this.viewer || this.viewer.isDestroyed()) return
      const now = new Date()
      this.satellites.forEach((item) => {
        const position = this.calculatePosition(item, now)
        if (!position) return
        const entity = this.satelliteEntities[item.id]
        if (entity) entity.position = position.cartesian
        if (item.id === this.selectedId) {
          this.currentPosition = {
            longitude: `${position.longitude.toFixed(2)}°`,
            latitude: `${position.latitude.toFixed(2)}°`,
            height: `${(position.height / 1000).toFixed(1)} km`
          }
        }
      })
      this.lastUpdated = now.toLocaleTimeString('zh-CN', { hour12: false })
    },

    // 计算完整一圈轨道点，并使用 Cesium polyline 显示。输入：卫星对象；输出：轨道实体。
    drawOrbit(item) {
      if (!item || !this.viewer) return
      if (this.orbitEntity) this.viewer.entities.remove(this.orbitEntity)

      // satrec.no 的单位是弧度/分钟，因此可以换算卫星绕行一圈所需时间。
      const periodMinutes = (2 * Math.PI) / item.satrec.no
      const sampleCount = 180
      const startTime = new Date(Date.now() - (periodMinutes * 60000) / 2)
      const points = []

      for (let i = 0; i <= sampleCount; i += 1) {
        const time = new Date(startTime.getTime() + (periodMinutes * 60000 * i) / sampleCount)
        const position = this.calculatePosition(item, time)
        if (position) points.push(position.cartesian)
      }

      this.orbitEntity = this.viewer.entities.add({
        name: `${item.name} 轨道`,
        polyline: {
          positions: points,
          width: 2.4,
          arcType: this.cesium.ArcType.NONE,
          material: new this.cesium.PolylineGlowMaterialProperty({
            color: this.cesium.Color.fromCssColorString(item.color).withAlpha(0.78),
            glowPower: 0.16
          })
        }
      })
    },

    // 绑定鼠标移动和点击事件，点击卫星点后切换当前卫星。
    bindMouseEvents() {
      this.mouseHandler = new this.cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      this.mouseHandler.setInputAction((movement) => {
        const entity = this.pickSatellite(movement.endPosition)
        const nextHoveredId = entity ? entity.satelliteId : null
        if (nextHoveredId !== this.hoveredId) {
          this.hoveredId = nextHoveredId
          this.updateEntityStyles()
          this.viewer.scene.canvas.style.cursor = nextHoveredId ? 'pointer' : 'default'
        }
      }, this.cesium.ScreenSpaceEventType.MOUSE_MOVE)

      this.mouseHandler.setInputAction((movement) => {
        const entity = this.pickSatellite(movement.position)
        if (entity && entity.satelliteId) this.selectSatellite(entity.satelliteId)
      }, this.cesium.ScreenSpaceEventType.LEFT_CLICK)
    },

    // 从鼠标位置拾取卫星实体。输入：屏幕坐标；输出：卫星实体或 null。
    pickSatellite(screenPosition) {
      if (!this.viewer) return null
      const picked = this.viewer.scene.pick(screenPosition)
      return picked && picked.id && picked.id.satelliteId ? picked.id : null
    },

    // 切换当前卫星，并同步信息区、点样式和轨道线。
    selectSatellite(id) {
      if (!id || id === this.selectedId) {
        this.refreshPositions()
        return
      }
      this.selectedId = id
      this.updateEntityStyles()
      this.refreshPositions()
      this.drawOrbit(this.selectedSatellite)
    },

    // 让选中的卫星点和标签比未选中的更容易辨认。
    updateEntityStyles() {
      this.satellites.forEach((item) => {
        const entity = this.satelliteEntities[item.id]
        if (!entity) return
        const active = item.id === this.selectedId
        const hovered = item.id === this.hoveredId
        entity.point.pixelSize = active || hovered ? 16 : 10
        entity.point.outlineWidth = active ? 3 : 2
        entity.label.scale = active || hovered ? 1.2 : 1
        entity.label.show = active || hovered
      })
    },

    // 浏览器尺寸变化时同步调整 Cesium 画布。
    resizeViewer() {
      if (this.viewer && !this.viewer.isDestroyed()) this.viewer.resize()
    }
  }
}
</script>

<style scoped>
/* 页面整体使用纯白背景和深色文字。 */
.visualize-view { display: flex; flex-direction: column; gap: 18px; }
.visualize-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; }
.eyebrow { color: #2563eb; font-size: 10px; font-weight: 700; letter-spacing: .2em; }
.visualize-heading h1 { margin: 10px 0 8px; color: #111827; font-size: 34px; }
.visualize-heading p { margin: 0; color: #667085; font-size: 13px; }

.visualize-layout { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 16px; min-height: 690px; }
.control-panel, .map-panel { overflow: hidden; border: 1px solid #dfe5ec; border-radius: 16px; background: #ffffff; box-shadow: 0 10px 30px rgba(15, 23, 42, .06); }
.control-panel { display: flex; flex-direction: column; min-height: 690px; }

.panel-heading { display: flex; align-items: center; justify-content: space-between; padding: 17px 18px; border-bottom: 1px solid #e5e7eb; }
.panel-heading > div { display: flex; flex-direction: column; gap: 3px; }
.panel-heading strong { color: #111827; font-size: 14px; }
.panel-heading small { color: #667085; font-size: 10px; }
.panel-live { display: flex; align-items: center; gap: 6px; color: #2563eb; font-size: 9px; letter-spacing: .1em; }
.panel-live i { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, .7); }

.satellite-switcher { display: flex; flex-direction: column; gap: 7px; padding: 12px; border-bottom: 1px solid #e5e7eb; }
.satellite-switcher button { display: grid; grid-template-columns: 15px 1fr auto; align-items: center; gap: 10px; width: 100%; padding: 11px 12px; color: #1f2937; border: 1px solid transparent; border-radius: 10px; background: #f8fafc; text-align: left; cursor: pointer; transition: border-color .18s ease, background .18s ease; }
.satellite-switcher button:hover, .satellite-switcher button.active { border-color: #bfdbfe; background: #eff6ff; }
.satellite-dot { width: 9px; height: 9px; border-radius: 50%; }
.switcher-copy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.switcher-copy strong { overflow: hidden; color: #111827; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.switcher-copy small { color: #667085; font-size: 10px; }
.switcher-arrow { color: #94a3b8; font-size: 14px; }
.satellite-switcher button.active .switcher-arrow { color: #2563eb; }

.info-card { flex: 1; padding: 18px; overflow-y: auto; }
.info-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.info-code { color: #2563eb; font-size: 11px; font-weight: 700; letter-spacing: .15em; }
.info-type { padding: 4px 7px; color: #475467; border: 1px solid #dfe5ec; border-radius: 999px; font-size: 9px; }
.info-card h2 { margin: 13px 0 8px; color: #111827; font-size: 22px; }
.info-card > p { margin: 0 0 16px; color: #667085; font-size: 11px; line-height: 1.8; }
.coordinate-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-bottom: 16px; }
.coordinate-grid div { padding: 9px 8px; border: 1px solid #dfe5ec; border-radius: 8px; background: #f8fafc; }
.coordinate-grid span { display: block; margin-bottom: 4px; color: #667085; font-size: 9px; }
.coordinate-grid strong { color: #1f2937; font-size: 11px; font-weight: 500; }

.map-panel { display: flex; flex-direction: column; min-width: 0; }
.map-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 65px; padding: 11px 18px; border-bottom: 1px solid #e5e7eb; background: #ffffff; }
.map-state { display: flex; align-items: center; gap: 10px; }
.state-dot { width: 8px; height: 8px; border-radius: 50%; background: #e2b75d; box-shadow: 0 0 8px rgba(226, 183, 93, .65); }
.state-dot.ready { background: #53efa1; box-shadow: 0 0 8px rgba(83, 239, 161, .65); }
.state-dot.error { background: #ff6e7f; box-shadow: 0 0 8px rgba(255, 110, 127, .65); }
.map-state div { display: flex; flex-direction: column; gap: 2px; }
.map-state strong { color: #111827; font-size: 12px; }
.map-state small { color: #667085; font-size: 9px; }
.map-legend { display: flex; align-items: center; gap: 16px; color: #667085; font-size: 10px; }
.map-legend span { display: flex; align-items: center; gap: 6px; }
.legend-point { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; box-shadow: 0 0 7px rgba(37, 99, 235, .65); }
.legend-line { width: 20px; height: 2px; background: #2563eb; box-shadow: 0 0 6px rgba(37, 99, 235, .55); }

/* 三维地图内部保留深色，以便清晰显示地球和卫星轨道。 */
.cesium-wrap { position: relative; flex: 1; min-height: 625px; background: #01050d; }
.cesium-container { position: absolute; inset: 0; }
.map-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; color: #dffcff; background: rgba(2, 8, 16, .88); }
.map-overlay strong { font-size: 14px; }
.map-overlay small { color: #b6c5d4; font-size: 11px; }
.loader-ring { width: 34px; height: 34px; border: 2px solid rgba(98, 243, 255, .18); border-top-color: #62f3ff; border-radius: 50%; animation: spin 1s linear infinite; }
.error-overlay strong { color: #ff9aa6; }
@keyframes spin { to { transform: rotate(360deg); } }

.mouse-tip { position: absolute; bottom: 18px; left: 50%; padding: 8px 12px; color: #d5e1ec; border: 1px solid rgba(98, 243, 255, .12); border-radius: 999px; background: rgba(2, 9, 18, .72); font-size: 10px; transform: translateX(-50%); backdrop-filter: blur(10px); }
@media (max-width: 980px) {
  .visualize-layout { grid-template-columns: 1fr; }
  .control-panel { min-height: 0; }
  .satellite-switcher { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .info-card { overflow: visible; }
  .cesium-wrap { min-height: 560px; }
}
@media (max-width: 620px) {
  .visualize-heading { align-items: flex-start; flex-direction: column; gap: 14px; }
  .satellite-switcher { grid-template-columns: 1fr; }
  .map-toolbar { align-items: flex-start; flex-direction: column; }
  .map-legend { display: none; }
  .cesium-wrap { min-height: 480px; }
}
</style>