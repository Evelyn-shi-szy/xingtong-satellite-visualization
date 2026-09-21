<!--
  [课程项目注释]
  文件作用：卫星信息页，实现卫星卡片列表、关键词过滤和详情弹窗。
  引用知识：Vue computed 计算属性、数组 filter、Element UI Dialog/Table、组件通信。
  参考资料：Vue 2 官方文档、Element UI 官方文档、国家卫星气象中心公开信息。
-->
<template>
  <div class="satellite-view">
    <div class="page-heading">
      <div>
        <div class="eyebrow">SATELLITE ARCHIVE · FY SERIES</div>
        <h1>卫星信息</h1>
      </div>
      <p>浏览风云系列卫星的基础档案。点击任意卡片即可查看轨道、载荷和任务说明。</p>
    </div>

    <div class="satellite-toolbar glass-panel">
      <div><span class="toolbar-mark"></span><strong>在轨卫星档案</strong><small>共 {{ satellites.length }} 颗展示卫星</small></div>
      <el-input v-model="keyword" size="small" placeholder="搜索卫星名称或用途" prefix-icon="el-icon-search"
        clearable></el-input>
    </div>
    <div v-if="filteredSatellites.length" class="satellite-grid"><satellite-card v-for="satellite in filteredSatellites"
        :key="satellite.id" :satellite="satellite" @select="openDetail"></satellite-card></div>
    <div v-else class="empty-state glass-panel"><i class="el-icon-search"></i><strong>没有找到匹配的卫星</strong><span>请尝试输入
        FY-4A、气象或降水等关键词。</span></div>

    <el-dialog :visible.sync="dialogVisible" :width="dialogWidth" custom-class="satellite-dialog">
      <template slot="title">
        <div class="dialog-title"><span class="dialog-satellite-icon"><i></i></span>
          <div><span>{{ selectedSatellite && selectedSatellite.shortName }}</span><strong>{{ selectedSatellite &&
              selectedSatellite.name }}</strong></div>
        </div>
      </template>
      <template v-if="selectedSatellite">
        <p class="dialog-summary">{{ selectedSatellite.summary }}</p>
        <div class="detail-highlight"><span>任务亮点</span><strong>{{ selectedSatellite.highlight }}</strong></div>
        <div class="detail-meta">
          <div><span>发射日期</span><strong>{{ selectedSatellite.launch }}</strong></div>
          <div><span>轨道位置</span><strong>{{ selectedSatellite.position }}</strong></div>
          <div><span>任务状态</span><strong>{{ selectedSatellite.status }}</strong></div>
        </div>
        <h4 class="detail-subtitle">主要载荷</h4>
        <div class="payload-list"><span v-for="payload in selectedSatellite.payloads" :key="payload"><i
              class="el-icon-cpu"></i>{{ payload }}</span></div>
        <el-table :data="detailRows" size="small"><el-table-column prop="label" label="参数"
            width="120"></el-table-column><el-table-column prop="value"></el-table-column></el-table>
        <p class="dialog-note"><i class="el-icon-info"></i>卫星参数用于课程展示，实际数据请以国家卫星气象中心等权威机构发布为准。</p>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import SatelliteCard from '../components/SatelliteCard.vue'
import { satellites } from '../data/satellites'

export default {
  name: 'SatelliteView',
  components: { SatelliteCard },
  data() { return { satellites, keyword: '', dialogVisible: false, selectedSatellite: null } },
  // computed 会根据 keyword 自动重新计算结果，关键字变化时不需要手动刷新列表。
  computed: {
    filteredSatellites() {
      // trim 去掉首尾空格，toLowerCase 让英文搜索不区分大小写。
      const key = this.keyword.trim().toLowerCase()
      if (!key) return this.satellites
      return this.satellites.filter((satellite) => [satellite.name, satellite.shortName, satellite.purpose, satellite.summary].join(' ').toLowerCase().includes(key))
    },
    // 弹窗表格只展示当前选中的卫星，避免每个卡片都重复准备一套详情数据。
    detailRows() {
      if (!this.selectedSatellite) return []
      return [
        { label: '轨道类型', value: this.selectedSatellite.orbit },
        { label: '空间分辨率', value: this.selectedSatellite.resolution },
        { label: '主要用途', value: this.selectedSatellite.purpose }
      ]
    },
    dialogWidth() { return window.innerWidth < 700 ? '92%' : '640px' }
  },
  // 点击卡片时保存当前卫星并打开 Element UI 对话框。
  methods: { openDetail(satellite) { this.selectedSatellite = satellite; this.dialogVisible = true } }
}
</script>

<style scoped>
.satellite-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.satellite-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 20px;
}

.satellite-toolbar>div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.satellite-toolbar strong {
  font-size: 14px;
}

.satellite-toolbar small {
  color: #6e8ba0;
  font-size: 11px;
}

.toolbar-mark {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00e5ff;
  box-shadow: 0 0 10px #00e5ff;
}

.satellite-toolbar .el-input {
  width: 230px;
}

.satellite-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.empty-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: 330px;
  gap: 10px;
  color: #8da9bf;
}

.empty-state i {
  color: #00e5ff;
  font-size: 30px;
}

.empty-state strong {
  color: #dffcff;
}

.empty-state span {
  font-size: 12px;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-title>div {
  display: flex;
  flex-direction: column;
}

.dialog-title span {
  color: #00e5ff;
  font-size: 11px;
  letter-spacing: .14em;
}

.dialog-title strong {
  margin-top: 4px;
  color: #eaf6ff;
  font-size: 18px;
}

.dialog-satellite-icon {
  position: relative;
  display: block;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(0, 229, 255, .5);
  border-radius: 50%;
}

.dialog-satellite-icon::before {
  content: "";
  position: absolute;
  top: 7px;
  left: 10px;
  width: 14px;
  height: 9px;
  border: 1px solid #bdfaff;
  background: #087fa6;
  transform: rotate(-20deg);
}

.dialog-satellite-icon::after {
  content: "";
  position: absolute;
  top: 12px;
  left: 4px;
  width: 26px;
  height: 5px;
  border-top: 1px solid #00e5ff;
  border-bottom: 1px solid #00e5ff;
  transform: rotate(-20deg);
}

.dialog-summary {
  margin: 0 0 16px;
  color: #a3bdcc;
  line-height: 1.8;
}

.detail-highlight {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px;
  border: 1px solid rgba(0, 229, 255, .16);
  border-radius: 10px;
  background: rgba(0, 168, 255, .08);
}

.detail-highlight span {
  color: #7898ae;
  font-size: 11px;
}

.detail-highlight strong {
  color: #00e5ff;
  font-size: 12px;
  text-align: right;
}

.detail-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 16px 0 20px;
}

.detail-meta div {
  padding: 11px;
  border: 1px solid rgba(0, 229, 255, .1);
  border-radius: 9px;
  background: rgba(3, 14, 25, .45);
}

.detail-meta span,
.detail-meta strong {
  display: block;
}

.detail-meta span {
  margin-bottom: 5px;
  color: #68849a;
  font-size: 11px;
}

.detail-meta strong {
  color: #dffcff;
  font-size: 12px;
}

.detail-subtitle {
  margin: 0 0 10px;
  color: #dffcff;
  font-size: 14px;
}

.payload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.payload-list span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border: 1px solid rgba(0, 229, 255, .12);
  border-radius: 7px;
  color: #9fc4d3;
  background: rgba(0, 168, 255, .06);
  font-size: 11px;
}

.payload-list i {
  color: #00e5ff;
}

.dialog-note {
  margin: 14px 0 0;
  color: #718da2;
  font-size: 11px;
  line-height: 1.6;
}

.dialog-note i {
  margin-right: 5px;
  color: #ffbf69;
}

@media (max-width: 1180px) {
  .satellite-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .satellite-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .satellite-toolbar .el-input {
    width: 100%;
  }

  .satellite-grid {
    grid-template-columns: 1fr;
  }

  .detail-meta {
    grid-template-columns: 1fr;
  }

  .detail-highlight {
    align-items: flex-start;
    flex-direction: column;
  }

  .detail-highlight strong {
    text-align: left;
  }
}
</style>