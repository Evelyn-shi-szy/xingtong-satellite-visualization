/**
 * [课程项目注释]
 * 文件作用：集中保存风云系列卫星的课程演示数据，供卫星信息页循环渲染。
 * 引用知识：ES Module 导出、JavaScript 数组与对象、组件间数据分离。
 * 数据参考：国家卫星气象中心、中国遥感卫星地面站、开运集团公开页面。
 * 注意：参数经过课程展示化整理，实际数据请以权威机构发布为准。
 */
// 数组中的每一项对应一张卫星卡片和一个详情弹窗。
export const satellites = [
  {
    // FY-4A：地球静止轨道气象卫星，用于天气监测和预报。
    id: 'fy-4a', index: '01', shortName: 'FY-4A', name: '风云四号 A 星', status: '在轨运行',
    summary: '我国新一代地球静止轨道气象卫星，可连续观测云系、大气与闪电活动。',
    orbit: '地球静止轨道', resolution: '可见光 0.5–1 km', launch: '2016-12-11', position: '约 104.7°E',
    payloads: ['AGRI 多通道扫描成像辐射计', 'GIIRS 干涉式大气垂直探测仪', 'LMI 闪电成像仪'],
    purpose: '天气监测、数值预报、气候研究', highlight: '15 分钟全圆盘观测能力（演示说明）'
  },
  {
    // FY-4B：风云四号系列业务卫星，用于短临天气和台风监测。
    id: 'fy-4b', index: '02', shortName: 'FY-4B', name: '风云四号 B 星', status: '在轨运行',
    summary: '风云四号系列业务卫星，面向天气系统连续监测和短临预报提供观测支持。',
    orbit: '地球静止轨道', resolution: '最高 250 m（AGRI 部分通道）', launch: '2021-06-03', position: '约 133°E',
    payloads: ['AGRI 快速成像仪', 'GIIRS 干涉式大气垂直探测仪', 'GMI 辐射计'],
    purpose: '短临天气、台风与强对流监测', highlight: '支持更快速区域扫描（演示说明）'
  },
  {
    // FY-3F：太阳同步轨道卫星，用于全球大气、地表和海洋观测。
    id: 'fy-3f', index: '03', shortName: 'FY-3F', name: '风云三号 F 星', status: '在轨运行',
    summary: '新一代极轨气象卫星，承担全球大气、地表与海洋环境的综合观测任务。',
    orbit: '太阳同步轨道', resolution: '最高 250 m', launch: '2023-08-03', position: '约 836 km 轨道高度',
    payloads: ['中分辨率光谱成像仪', '红外高光谱大气探测仪', '微波成像仪'],
    purpose: '全球数值预报、生态与灾害监测', highlight: '覆盖全球的极轨观测（演示说明）'
  },
  {
    // FY-3G：降水测量专用卫星，用于降水、台风和洪涝监测。
    id: 'fy-3g', index: '04', shortName: 'FY-3G', name: '风云三号 G 星', status: '在轨运行',
    summary: '我国首颗降水测量专用卫星，重点获取降水结构、强度与三维分布信息。',
    orbit: '太阳同步轨道', resolution: '降水探测 500 m 级', launch: '2023-04-16', position: '约 407 km 轨道高度',
    payloads: ['双频降水测量雷达', '微波成像仪', '降水测量组合仪'],
    purpose: '降水监测、台风与洪涝预警', highlight: '主动降水测量能力（演示说明）'
  }
]

// 同时保留默认导出，便于其他页面按需替换数据来源。
export default satellites