<template>
  <div class="home-view">
    <section class="hero-panel">
      <div class="hero-copy">
        <span class="eyebrow">SATELLITE VISUALIZATION · 01</span>
        <h1><span>星瞳</span>卫星可视化浏览平台</h1>
        <p>
          读取本地卫星 TLE 数据，通过 satellite.js 计算卫星位置，再在 Cesium 三维地球中展示卫星点与运行轨道。
        </p>
        <div class="hero-actions">
          <router-link class="primary-button" to="/visualize">进入卫星可视化 <span>→</span></router-link>
          <a class="text-link" href="#satellite-list">先查看卫星列表</a>
        </div>
        <div class="hero-stats" aria-label="项目信息">
          <div><strong>4</strong><span>颗演示卫星</span></div>
          <div><strong>1</strong><span>条当前轨道</span></div>
          <div><strong>3</strong><span>项核心功能</span></div>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="visual-grid"></div>
        <div class="earth-sphere">
          <span class="earth-glow"></span>
          <span class="earth-line line-one"></span>
          <span class="earth-line line-two"></span>
          <span class="earth-line line-three"></span>
        </div>
        <div class="orbit-path orbit-path-one"></div>
        <div class="orbit-path orbit-path-two"></div>
        <span class="orbit-dot dot-one"></span>
        <span class="orbit-dot dot-two"></span>
        <span class="visual-note"><i></i> LIVE ORBIT VIEW</span>
      </div>
    </section>

    <section id="satellite-list" class="satellite-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">LOCAL TLE DATA · 4 OBJECTS</span>
          <h2>认识本次展示的卫星</h2>
        </div>
        <p>每颗卫星都使用本地两行根数，不依赖远程接口。选择任意卫星即可进入三维可视化页面。</p>
      </div>

      <div class="satellite-grid">
        <article v-for="(satellite, index) in satellites" :key="satellite.id" class="satellite-card">
          <div class="card-topline">
            <span class="card-index">0{{ index + 1 }}</span>
            <span class="type-tag">{{ satellite.type }}</span>
          </div>
          <div class="card-orbit-mark" :style="{ '--sat-color': satellite.color }">
            <span></span><i></i>
          </div>
          <h3>{{ satellite.name }}</h3>
          <p>{{ satellite.description }}</p>
          <router-link :to="{ name: 'visualize', query: { satellite: satellite.id } }">
            在三维地球中查看 <span>→</span>
          </router-link>
        </article>
      </div>
    </section>

    <section class="flow-panel">
      <div class="flow-number">02</div>
      <div class="flow-copy">
        <span class="eyebrow">CORE FLOW</span>
        <h2>从 TLE 到轨道线</h2>
        <p>页面只保留课堂上容易解释的三步：读取数据、计算位置、显示卫星与轨道。</p>
      </div>
      <ol class="flow-list">
        <li><span>01</span><strong>读取 TLE</strong><small>satelliteData</small></li>
        <li><span>02</span><strong>计算位置</strong><small>satellite.js</small></li>
        <li><span>03</span><strong>三维显示</strong><small>Cesium</small></li>
      </ol>
    </section>
  </div>
</template>

<script>
import satelliteData from '../data/satellites'

export default {
  name: 'HomeView',
  data() {
    return { satellites: satelliteData }
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero-panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, .95fr);
  min-height: 560px;
  overflow: hidden;
  border: 1px solid rgba(98, 243, 255, .16);
  border-radius: 22px;
  background:
    radial-gradient(circle at 78% 40%, rgba(22, 130, 190, .2), transparent 34%),
    linear-gradient(125deg, rgba(8, 24, 42, .96), rgba(4, 12, 24, .9));
  box-shadow: 0 28px 80px rgba(0, 0, 0, .3);
}

.hero-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(rgba(98, 243, 255, .04) 1px, transparent 1px), linear-gradient(90deg, rgba(98, 243, 255, .04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to right, black, transparent 75%);
}

.hero-copy {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 72px 68px;
}

.eyebrow {
  color: #62f3ff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .22em;
}

.hero-copy h1 {
  max-width: 690px;
  margin: 18px 0 20px;
  color: #f4fdff;
  font-size: clamp(42px, 5.2vw, 72px);
  line-height: 1.08;
  letter-spacing: -.04em;
}

.hero-copy h1 span {
  display: block;
  color: #62f3ff;
  font-size: .82em;
  text-shadow: 0 0 28px rgba(98, 243, 255, .25);
}

.hero-copy > p {
  max-width: 650px;
  margin: 0;
  color: #91adc3;
  font-size: 16px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 34px;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  min-width: 220px;
  padding: 15px 18px;
  color: #021019;
  border-radius: 10px;
  background: linear-gradient(135deg, #91faff, #56d7f3 55%, #32a6df);
  box-shadow: 0 12px 32px rgba(53, 202, 239, .2);
  font-size: 14px;
  font-weight: 700;
  transition: transform .2s ease, box-shadow .2s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 38px rgba(53, 202, 239, .3);
}

.primary-button span {
  font-size: 18px;
}

.text-link {
  color: #9cb9cd;
  border-bottom: 1px solid rgba(156, 185, 205, .28);
  font-size: 13px;
}

.text-link:hover {
  color: #62f3ff;
  border-color: #62f3ff;
}

.hero-stats {
  display: flex;
  gap: 34px;
  margin-top: 48px;
}

.hero-stats div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-stats strong {
  color: #f2fcff;
  font-size: 24px;
  font-weight: 500;
}

.hero-stats span {
  color: #638298;
  font-size: 11px;
}

.hero-visual {
  position: relative;
  min-height: 520px;
}

.visual-grid {
  position: absolute;
  inset: 0;
  opacity: .42;
  background:
    linear-gradient(rgba(98, 243, 255, .08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(98, 243, 255, .08) 1px, transparent 1px);
  background-size: 42px 42px;
  transform: perspective(440px) rotateX(58deg) scale(1.35) translateY(4%);
  mask-image: radial-gradient(circle at center, black, transparent 68%);
}

.earth-sphere {
  position: absolute;
  top: 50%;
  left: 51%;
  width: 330px;
  height: 330px;
  overflow: hidden;
  border: 1px solid rgba(136, 242, 255, .32);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 34% 30%, #164f70, #08283f 43%, #03101e 72%);
  box-shadow: inset -28px -22px 70px rgba(0, 0, 0, .72), 0 0 60px rgba(23, 144, 192, .18);
}

.earth-glow {
  position: absolute;
  inset: -8%;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 32%, rgba(130, 247, 255, .12), transparent 58%);
}

.earth-line {
  position: absolute;
  border: 1px solid rgba(105, 221, 239, .23);
  border-radius: 50%;
}

.line-one {
  top: 44%;
  left: -8%;
  width: 116%;
  height: 36%;
}

.line-two {
  top: 23%;
  left: 21%;
  width: 58%;
  height: 54%;
}

.line-three {
  top: -6%;
  left: 44%;
  width: 25%;
  height: 112%;
}

.orbit-path {
  position: absolute;
  top: 50%;
  left: 51%;
  border: 1px solid rgba(130, 247, 255, .58);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(-18deg);
}

.orbit-path-one {
  width: 530px;
  height: 166px;
}

.orbit-path-two {
  width: 390px;
  height: 450px;
  border-color: rgba(76, 163, 218, .24);
  transform: translate(-50%, -50%) rotate(46deg);
}

.orbit-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #dffcff;
  border-radius: 50%;
  background: #62f3ff;
  box-shadow: 0 0 20px #62f3ff;
}

.dot-one {
  top: 37%;
  left: 12%;
}

.dot-two {
  right: 13%;
  bottom: 25%;
  background: #ffd166;
  box-shadow: 0 0 20px #ffd166;
}

.visual-note {
  position: absolute;
  right: 34px;
  bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7092a9;
  font-size: 10px;
  letter-spacing: .18em;
}

.visual-note i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #62f3ff;
  box-shadow: 0 0 12px #62f3ff;
}

.satellite-section {
  padding: 26px;
  border: 1px solid rgba(98, 243, 255, .12);
  border-radius: 20px;
  background: rgba(6, 17, 31, .68);
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 24px;
}

.section-heading h2,
.flow-copy h2 {
  margin: 10px 0 0;
  color: #eefbff;
  font-size: 28px;
  font-weight: 600;
}

.section-heading > p {
  max-width: 540px;
  margin: 0;
  color: #7895aa;
  font-size: 13px;
  line-height: 1.8;
}

.satellite-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.satellite-card {
  display: flex;
  flex-direction: column;
  min-height: 360px;
  padding: 20px;
  border: 1px solid rgba(98, 243, 255, .12);
  border-radius: 15px;
  background: linear-gradient(155deg, rgba(11, 31, 50, .88), rgba(5, 13, 25, .92));
  transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
}

.satellite-card:hover {
  transform: translateY(-5px);
  border-color: rgba(98, 243, 255, .45);
  box-shadow: 0 18px 44px rgba(0, 0, 0, .28), 0 0 26px rgba(98, 243, 255, .06);
}

.card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-index {
  color: #4e738b;
  font-size: 12px;
  letter-spacing: .14em;
}

.type-tag {
  padding: 5px 8px;
  color: #8be9f5;
  border: 1px solid rgba(98, 243, 255, .16);
  border-radius: 999px;
  background: rgba(98, 243, 255, .05);
  font-size: 10px;
}

.card-orbit-mark {
  position: relative;
  height: 92px;
  margin: 22px -4px 14px;
}

.card-orbit-mark::before,
.card-orbit-mark::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid color-mix(in srgb, var(--sat-color), transparent 56%);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(-14deg);
}

.card-orbit-mark::before {
  width: 150px;
  height: 42px;
}

.card-orbit-mark::after {
  width: 82px;
  height: 74px;
  transform: translate(-50%, -50%) rotate(50deg);
}

.card-orbit-mark span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--sat-color), white 28%), #0b3852 48%, #04101c 74%);
  box-shadow: 0 0 24px color-mix(in srgb, var(--sat-color), transparent 76%);
}

.card-orbit-mark i {
  position: absolute;
  top: 30%;
  right: 26%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sat-color);
  box-shadow: 0 0 14px var(--sat-color);
}

.satellite-card h3 {
  margin: 0 0 10px;
  color: #effcff;
  font-size: 19px;
}

.satellite-card > p {
  flex: 1;
  margin: 0;
  color: #819fb4;
  font-size: 12px;
  line-height: 1.8;
}

.satellite-card a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
  padding-top: 14px;
  color: #62f3ff;
  border-top: 1px solid rgba(98, 243, 255, .1);
  font-size: 12px;
}

.satellite-card a span {
  font-size: 17px;
  transition: transform .2s ease;
}

.satellite-card a:hover span {
  transform: translateX(4px);
}

.flow-panel {
  display: grid;
  grid-template-columns: 100px minmax(260px, .7fr) minmax(500px, 1.3fr);
  align-items: center;
  gap: 30px;
  padding: 28px 34px;
  border: 1px solid rgba(98, 243, 255, .12);
  border-radius: 18px;
  background: rgba(5, 15, 28, .7);
}

.flow-number {
  color: rgba(98, 243, 255, .15);
  font-size: 62px;
  font-weight: 700;
}

.flow-copy p {
  margin: 10px 0 0;
  color: #718ea3;
  font-size: 12px;
  line-height: 1.7;
}

.flow-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.flow-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 10px;
  padding: 15px;
  border: 1px solid rgba(98, 243, 255, .1);
  border-radius: 12px;
  background: rgba(4, 13, 25, .66);
}

.flow-list li > span {
  grid-row: 1 / 3;
  color: #4c748c;
  font-size: 11px;
}

.flow-list strong {
  color: #dffcff;
  font-size: 13px;
}

.flow-list small {
  color: #638298;
  font-size: 10px;
}

@media (max-width: 1180px) {
  .hero-panel {
    grid-template-columns: 1fr .8fr;
  }

  .hero-copy {
    padding: 54px 44px;
  }

  .satellite-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .flow-panel {
    grid-template-columns: 70px 1fr;
  }

  .flow-list {
    grid-column: 1 / -1;
  }
}

@media (max-width: 800px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    padding: 44px 28px 28px;
  }

  .hero-visual {
    min-height: 400px;
  }

  .earth-sphere {
    width: 245px;
    height: 245px;
  }

  .orbit-path-one {
    width: 410px;
    height: 132px;
  }

  .orbit-path-two {
    width: 300px;
    height: 360px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .satellite-grid {
    grid-template-columns: 1fr;
  }

  .flow-panel {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .flow-number {
    display: none;
  }
}

@media (max-width: 520px) {
  .hero-actions,
  .hero-stats {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-stats {
    gap: 16px;
  }

  .flow-list {
    grid-template-columns: 1fr;
  }
}
</style>