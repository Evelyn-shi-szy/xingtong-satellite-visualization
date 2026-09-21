<!--
  [课程项目注释]
  文件作用：复用型卫星信息卡片，通过 props 接收数据并向父组件发出选择事件。
  引用知识：Vue 组件 props、单向数据流、$emit 自定义事件、键盘可访问性。
  参考资料：Vue 2 组件文档、MDN 可访问性。
-->
<template>
  <article class="satellite-card glass-panel" tabindex="0" @click="$emit('select', satellite)"
    @keyup.enter="$emit('select', satellite)">
    <div class="card-visual">
      <div class="orbit orbit-one"></div>
      <div class="orbit orbit-two"></div>
      <div class="satellite-body"><span></span><i></i></div>
      <div class="visual-label">{{ satellite.shortName }}</div>
    </div>
    <div class="card-content">
      <div class="card-topline"><span class="status-dot"></span><span>{{ satellite.status }}</span><span
          class="card-index">{{ satellite.index }}</span></div>
      <h3>{{ satellite.name }}</h3>
      <p>{{ satellite.summary }}</p>
      <dl>
        <div>
          <dt>轨道类型</dt>
          <dd>{{ satellite.orbit }}</dd>
        </div>
        <div>
          <dt>空间分辨率</dt>
          <dd>{{ satellite.resolution }}</dd>
        </div>
      </dl>
      <button class="detail-link" type="button">查看详情 <span aria-hidden="true">→</span></button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'SatelliteCard',
  // props 由父组件传入卫星对象，卡片不直接修改数据，符合 Vue 单向数据流。
  props: { satellite: { type: Object, required: true } }
}
</script>

<style scoped>
.satellite-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.satellite-card:hover,
.satellite-card:focus {
  outline: none;
  transform: translateY(-6px);
  border-color: rgba(0, 229, 255, .56);
  box-shadow: 0 24px 60px rgba(0, 0, 0, .38), 0 0 32px rgba(0, 168, 255, .1);
}

.card-visual {
  position: relative;
  height: 184px;
  overflow: hidden;
  background: radial-gradient(circle at 63% 48%, rgba(0, 229, 255, .14), transparent 34%), linear-gradient(150deg, rgba(5, 26, 45, .92), rgba(11, 48, 72, .54));
}

.card-visual::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: .35;
  background-image: linear-gradient(rgba(0, 229, 255, .18) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, .18) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, black, transparent);
}

.orbit {
  position: absolute;
  border: 1px solid rgba(118, 239, 255, .55);
  border-radius: 50%;
  transform: rotate(-22deg);
}

.orbit-one {
  top: 32px;
  left: 22%;
  width: 190px;
  height: 76px;
}

.orbit-two {
  top: 13px;
  left: 28%;
  width: 152px;
  height: 126px;
  border-color: rgba(0, 168, 255, .28);
  transform: rotate(35deg);
}

.satellite-body {
  position: absolute;
  top: 67px;
  left: 53%;
  width: 56px;
  height: 38px;
  transform: translateX(-50%) rotate(-18deg);
}

.satellite-body span {
  position: absolute;
  top: 8px;
  left: 11px;
  width: 34px;
  height: 22px;
  border: 1px solid #bdfaff;
  border-radius: 3px;
  background: linear-gradient(135deg, #69e4f5, #1a7ab8);
  box-shadow: 0 0 18px rgba(0, 229, 255, .7);
}

.satellite-body span::before,
.satellite-body span::after {
  content: "";
  position: absolute;
  top: 5px;
  width: 38px;
  height: 12px;
  border: 1px solid rgba(178, 245, 255, .75);
  background: repeating-linear-gradient(90deg, rgba(0, 229, 255, .32) 0 4px, rgba(1, 28, 48, .9) 4px 7px);
}

.satellite-body span::before {
  right: 33px;
}

.satellite-body span::after {
  left: 33px;
}

.satellite-body i {
  position: absolute;
  top: 19px;
  left: 26px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px #00e5ff;
}

.visual-label {
  position: absolute;
  right: 20px;
  bottom: 16px;
  color: rgba(147, 226, 242, .32);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: .1em;
}

.card-content {
  padding: 20px;
}

.card-topline {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #78efff;
  font-size: 12px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2dd4bf;
  box-shadow: 0 0 10px #2dd4bf;
}

.card-index {
  margin-left: auto;
  color: #5c7c91;
}

.card-content h3 {
  margin: 14px 0 8px;
  color: #f5fdff;
  font-size: 22px;
}

.card-content>p {
  min-height: 48px;
  margin: 0;
  color: #8da9bf;
  font-size: 13px;
  line-height: 1.7;
}

dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 18px 0 20px;
}

dl div {
  padding: 10px 12px;
  border: 1px solid rgba(0, 229, 255, .1);
  border-radius: 10px;
  background: rgba(3, 14, 25, .46);
}

dt {
  margin-bottom: 5px;
  color: #658399;
  font-size: 11px;
}

dd {
  margin: 0;
  color: #dffcff;
  font-size: 13px;
}

.detail-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px 0 0;
  color: #00e5ff;
  border: 0;
  border-top: 1px solid rgba(0, 229, 255, .12);
  background: transparent;
  cursor: pointer;
}

.detail-link span {
  font-size: 18px;
  transition: transform .2s ease;
}

.satellite-card:hover .detail-link span {
  transform: translateX(4px);
}
</style>