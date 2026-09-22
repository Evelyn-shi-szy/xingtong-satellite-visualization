<template>
  <div class="visualize-view">
    <header class="heading">
      <span>STAR EYE · SATELLITE VISUALIZATION</span>
      <h1>卫星可视化</h1>
      <p>展示卫星基础信息、轨道参数和简单轨道动画。点击卫星列表可直接定位到对应内容。</p>
    </header>

    <!-- 卫星列表：点击后只滚动，不切换页面内容。 -->
    <nav class="satellite-nav">
      <button v-for="item in satellites" :key="item.id" @click="scrollTo(item.id)">
        <i :style="{ background: item.color }"></i>
        {{ item.name }}
      </button>
    </nav>

    <!-- 所有卫星直接陈列。 -->
    <section class="satellite-list">
      <article v-for="item in satellites" :key="item.id" :id="'satellite-' + item.id" class="satellite-card">
        <div class="orbit-box">
          <div class="earth">地球</div>
          <div class="orbit"><i :style="{ background: item.color }"></i></div>
        </div>

        <div class="info">
          <span :style="{ color: item.color }">{{ item.shortName }} · {{ item.type }}</span>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <div class="params">
            <div><small>轨道高度</small><strong>{{ item.altitude }}</strong></div>
            <div><small>轨道倾角</small><strong>{{ item.inclination }}</strong></div>
            <div><small>运行周期</small><strong>{{ item.period }}</strong></div>
            <div><small>运行状态</small><strong>{{ item.status }}</strong></div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import satellites from '../data/satellites'

export default {
  name: 'VisualizeView',
  data() {
    return { satellites }
  },
  methods: {
    // 根据 id 找到对应卡片，再平滑滚动过去。
    scrollTo(id) {
      document.getElementById('satellite-' + id).scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
</script>

<style scoped>
.visualize-view { display: flex; flex-direction: column; gap: 18px; }
.heading span { color: #62f3ff; font-size: 10px; letter-spacing: .2em; }
.heading h1 { margin: 8px 0; color: #f2fcff; font-size: 34px; }
.heading p { margin: 0; color: #7997ad; font-size: 13px; }

.satellite-nav { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 12px; border: 1px solid #17384a; border-radius: 14px; background: #071321; }
.satellite-nav button { padding: 12px; color: #dffcff; border: 1px solid #17384a; border-radius: 8px; background: #0a1a2a; cursor: pointer; }
.satellite-nav button:hover { background: #123047; }
.satellite-nav i { display: inline-block; width: 8px; height: 8px; margin-right: 7px; border-radius: 50%; }

.satellite-list { display: flex; flex-direction: column; gap: 16px; }
.satellite-card { display: grid; grid-template-columns: 280px 1fr; min-height: 250px; padding: 22px; border: 1px solid #17384a; border-radius: 14px; background: #071321; scroll-margin-top: 100px; }
.orbit-box { position: relative; display: flex; align-items: center; justify-content: center; }
.earth { display: flex; align-items: center; justify-content: center; width: 90px; height: 90px; color: #bffaff; border-radius: 50%; background: #0d5272; box-shadow: 0 0 25px #0d5272; }
.orbit { position: absolute; width: 210px; height: 105px; border: 1px solid #4a829b; border-radius: 50%; transform: rotate(-20deg); }
.orbit i { position: absolute; top: 42px; left: -5px; width: 11px; height: 11px; border-radius: 50%; animation: satelliteMove 5s linear infinite; }
@keyframes satelliteMove { 50% { left: 204px; } }

.info { padding: 15px; }
.info > span { font-size: 11px; font-weight: bold; }
.info h2 { margin: 7px 0 10px; color: #f2fcff; font-size: 24px; }
.info p { color: #7997ad; font-size: 12px; line-height: 1.8; }
.params { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 18px; }
.params div { padding: 11px; border: 1px solid #17384a; border-radius: 7px; background: #091827; }
.params small, .params strong { display: block; }
.params small { margin-bottom: 5px; color: #64869b; }
.params strong { color: #dffcff; font-size: 12px; }

@media (max-width: 800px) {
  .satellite-nav, .params { grid-template-columns: repeat(2, 1fr); }
  .satellite-card { grid-template-columns: 1fr; }
  .orbit-box { min-height: 180px; }
}
</style>
