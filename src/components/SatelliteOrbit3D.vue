<!--
  [文件说明]
  文件作用：在页面底部显示可旋转的 Cesium 三维地球，并同时绘制四颗卫星的轨道。
  技术流程：
  1. 读取 satellites.js 中的 TLE；
  2. 使用 satellite.js 计算卫星位置；
  3. 使用 Cesium 创建卫星点和 polyline 轨道线。
-->
<template>
  <section class="orbit-section">
    <div class="orbit-heading">
      <div>
        <span>3D ORBIT VIEW · FOUR SATELLITES</span>
        <h2>四颗卫星三维轨道</h2>
        <p>拖动地球可旋转视角，滚轮可缩放。四种颜色分别对应上方四颗卫星。</p>
      </div>
      <div class="orbit-status">
        <i :class="{ ready: cesiumReady, error: cesiumError }"></i>
        {{ statusText }}
      </div>
    </div>

    <div class="viewer-wrap">
      <div ref="cesiumContainer" class="cesium-container"></div>

      <!-- Cesium 初始化时显示加载提示。 -->
      <div v-if="!cesiumReady && !cesiumError" class="viewer-overlay">
        <span class="loading-ring"></span>
        <strong>正在加载三维轨道</strong>
      </div>

      <!-- 初始化失败时显示错误信息。 -->
      <div v-if="cesiumError" class="viewer-overlay error">
        <strong>三维地球加载失败</strong>
        <small>{{ cesiumError }}</small>
      </div>

      <!-- 四条轨道和卫星颜色图例。 -->
      <div v-if="cesiumReady" class="orbit-legend">
        <span v-for="item in satellites" :key="item.id">
          <i :style="{ background: item.color, boxShadow: `0 0 10px ${item.color}` }"></i>
          {{ item.shortName }}
        </span>
      </div>

      <div class="viewer-tip">拖动旋转 · 滚轮缩放 · 四条彩色线为卫星轨道</div>
    </div>
  </section>
</template>

<script>
import * as satellite from 'satellite.js'
import satellites from '../data/satellites'

export default {
  name: 'SatelliteOrbit3D',
  data() {
    return {
      // 每颗卫星先使用 twoline2satrec() 生成 satrec，后续计算位置和轨道。
      satellites: satellites.map((item) => ({
        ...item,
        satrec: satellite.twoline2satrec(item.tle1, item.tle2)
      })),
      viewer: null,
      cesium: null,
      satelliteEntities: {},
      orbitEntities: [],
      timer: null,
      cesiumReady: false,
      cesiumError: ''
    }
  },
  computed: {
    statusText() {
      if (this.cesiumError) return '加载失败'
      return this.cesiumReady ? '三维轨道已就绪' : '正在初始化'
    }
  },
  mounted() {
    // 等待 DOM 容器出现后再创建 Cesium Viewer。
    this.$nextTick(this.initCesium)
  },
  beforeDestroy() {
    // 离开页面时清理定时器和 Cesium，避免占用浏览器 WebGL 资源。
    if (this.timer) window.clearInterval(this.timer)
    if (this.viewer && !this.viewer.isDestroyed()) this.viewer.destroy()
  },
  methods: {
    // 初始化 Cesium 场景。输入为空；输出为可旋转的三维地球。
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
          skyAtmosphere: false
        })

        // 隐藏默认版权栏，保持深色页面简洁。
        if (viewer.cesiumWidget && viewer.cesiumWidget.creditContainer) {
          viewer.cesiumWidget.creditContainer.style.display = 'none'
        }

        // 使用本地网格球体，不依赖在线地图服务。
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#01050d')
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a2943')
        viewer.scene.globe.showGroundAtmosphere = true
        viewer.imageryLayers.addImageryProvider(new Cesium.GridImageryProvider({
          color: Cesium.Color.fromCssColorString('#8deaf4').withAlpha(0.24),
          glowColor: Cesium.Color.fromCssColorString('#3e9cc4').withAlpha(0.08),
          backgroundColor: Cesium.Color.fromCssColorString('#09283d'),
          cells: 6
        }))

        // 初始视角能够同时看到地球和四颗近地卫星的轨道。
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(105, 25, 22000000),
          orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 }
        })

        this.viewer = viewer
        this.addSatelliteEntities()
        this.drawAllOrbits()
        this.refreshPositions()
        this.timer = window.setInterval(this.refreshPositions, 1000)
        this.cesiumReady = true
      } catch (error) {
        this.cesiumError = error && error.message ? error.message : '初始化异常'
      }
    },

    // 根据卫星和指定时间计算经纬度、高度与 Cesium 坐标。
    calculatePosition(item, date) {
      const result = satellite.propagate(item.satrec, date)
      if (!result || !result.position) return null

      // ECI 坐标需要结合当前时刻的格林尼治恒星时转换为经纬度。
      const gmst = satellite.gstime(date)
      const geodetic = satellite.eciToGeodetic(result.position, gmst)
      const longitude = satellite.radiansToDegrees(geodetic.longitude)
      const latitude = satellite.radiansToDegrees(geodetic.latitude)
      const height = geodetic.height * 1000

      return {
        cartesian: this.cesium.Cartesian3.fromDegrees(longitude, latitude, height)
      }
    },

    // 为四颗卫星分别创建卫星点和名称标签。
    addSatelliteEntities() {
      const now = new Date()
      this.satellites.forEach((item) => {
        const position = this.calculatePosition(item, now)
        if (!position) return

        const entity = this.viewer.entities.add({
          name: item.name,
          position: position.cartesian,
          point: {
            pixelSize: 10,
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
            pixelOffset: new this.cesium.Cartesian2(0, -22)
          }
        })
        this.satelliteEntities[item.id] = entity
      })
    },

    // 每秒刷新四颗卫星的当前位置。
    refreshPositions() {
      if (!this.viewer || this.viewer.isDestroyed()) return
      const now = new Date()
      this.satellites.forEach((item) => {
        const position = this.calculatePosition(item, now)
        const entity = this.satelliteEntities[item.id]
        if (position && entity) entity.position = position.cartesian
      })
    },

    // 同时绘制四颗卫星各自完整一圈的轨道线。
    drawAllOrbits() {
      this.satellites.forEach((item) => {
        const points = this.buildOrbitPoints(item)
        if (!points.length) return

        const entity = this.viewer.entities.add({
          name: `${item.name} 轨道`,
          polyline: {
            positions: points,
            width: 2.2,
            arcType: this.cesium.ArcType.NONE,
            material: new this.cesium.PolylineGlowMaterialProperty({
              color: this.cesium.Color.fromCssColorString(item.color).withAlpha(0.78),
              glowPower: 0.16
            })
          }
        })
        this.orbitEntities.push(entity)
      })
    },

    // 根据 TLE 的轨道周期生成一圈轨道采样点。
    buildOrbitPoints(item) {
      const periodMinutes = (2 * Math.PI) / item.satrec.no
      const sampleCount = 180
      const startTime = new Date(Date.now() - (periodMinutes * 60000) / 2)
      const points = []

      for (let i = 0; i <= sampleCount; i += 1) {
        const time = new Date(startTime.getTime() + (periodMinutes * 60000 * i) / sampleCount)
        const position = this.calculatePosition(item, time)
        if (position) points.push(position.cartesian)
      }
      return points
    }
  }
}
</script>

<style scoped>
.orbit-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border: 1px solid #dfe5ec;
  border-radius: 14px;
  background: #ffffff;
}

.orbit-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.orbit-heading span {
  color: #2563eb;
  font-size: 10px;
  letter-spacing: .2em;
}

.orbit-heading h2 {
  margin: 8px 0;
  color: #111827;
  font-size: 28px;
}

.orbit-heading p {
  margin: 0;
  color: #667085;
  font-size: 12px;
}

.orbit-status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  color: #667085;
  font-size: 11px;
}

.orbit-status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d4a84d;
}

.orbit-status i.ready {
  background: #53efa1;
  box-shadow: 0 0 10px #53efa1;
}

.orbit-status i.error {
  background: #ff6e7f;
}

.viewer-wrap {
  position: relative;
  min-height: 620px;
  overflow: hidden;
  border: 1px solid #dfe5ec;
  border-radius: 12px;
  background: #01050d;
}

.cesium-container {
  position: absolute;
  inset: 0;
}

.viewer-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  color: #dffcff;
  background: rgba(2, 8, 16, .9);
}

.viewer-overlay small {
  color: #b6c5d4;
}

.viewer-overlay.error strong {
  color: #ff9aa6;
}

.loading-ring {
  width: 34px;
  height: 34px;
  border: 2px solid rgba(98, 243, 255, .2);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: loadingSpin 1s linear infinite;
}

@keyframes loadingSpin {
  to { transform: rotate(360deg); }
}

.orbit-legend {
  position: absolute;
  z-index: 3;
  top: 14px;
  left: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: calc(100% - 28px);
}

.orbit-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  color: #dffcff;
  border: 1px solid rgba(98, 243, 255, .14);
  border-radius: 7px;
  background: rgba(4, 14, 25, .76);
  font-size: 10px;
}

.orbit-legend i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.viewer-tip {
  position: absolute;
  z-index: 3;
  bottom: 14px;
  left: 50%;
  padding: 8px 12px;
  color: #89a9bc;
  border: 1px solid rgba(98, 243, 255, .12);
  border-radius: 999px;
  background: rgba(2, 9, 18, .72);
  font-size: 10px;
  white-space: nowrap;
  transform: translateX(-50%);
}

@media (max-width: 800px) {
  .orbit-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .viewer-wrap {
    min-height: 480px;
  }
}
</style>