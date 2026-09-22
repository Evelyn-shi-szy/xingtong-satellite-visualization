// 卫星演示数据：只保存页面要展示的基础参数，不请求接口、不做复杂轨道计算。
export default [
  { id: 1, shortName: 'CSS', name: '中国空间站', type: '载人空间站', altitude: '约 390 km', inclination: '41.5°', period: '约 92 分钟', status: '在轨运行', color: '#62f3ff', description: '近地轨道载人空间站，用于空间科学实验和航天员长期驻留。' },
  { id: 2, shortName: 'ISS', name: '国际空间站', type: '载人空间站', altitude: '约 420 km', inclination: '51.6°', period: '约 93 分钟', status: '在轨运行', color: '#ffd166', description: '多国合作建设的近地轨道空间站，主要开展微重力科学实验。' },
  { id: 3, shortName: 'HST', name: '哈勃空间望远镜', type: '空间望远镜', altitude: '约 540 km', inclination: '28.5°', period: '约 95 分钟', status: '在轨运行', color: '#ae8cff', description: '位于地球大气层外的空间望远镜，用于天文观测和宇宙研究。' },
  { id: 4, shortName: 'FY-3F', name: '风云三号 F 星', type: '气象卫星', altitude: '约 830 km', inclination: '98.7°', period: '约 101 分钟', status: '在轨运行', color: '#7ef29d', description: '太阳同步轨道气象卫星，用于获取全球大气、地表和海洋观测数据。' }
]
