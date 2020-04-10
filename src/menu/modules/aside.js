export default [
  { path: '/index',
    title: '首页',
    alias: '我的待办',
    icon: 'home',
    children: (pre => [
      { path: `${pre}todo`, title: '待办', icon: 'home' },
      { path: `${pre}done`, title: '已办', icon: 'clipboard' },
      { path: `${pre}pending`, title: '待阅', icon: 'clock-o' },
      { path: `${pre}read`, title: '已阅', icon: 'asterisk' }
    ])('/news/')
  },
  {
    path: '/project-management',
    title: '项目管理',
    icon: 'plug',
    children: (pre => [
      { path: `${pre}index`, title: '插件', icon: 'home' },
      {
        path: `${pre}mock`,
        title: '模拟数据',
        icon: 'globe',
        children: [
          { path: `${pre}mock/ajax`, title: '拦截异步请求' },
          { path: `${pre}mock/dpd`, title: 'DPD 规则' },
          { path: `${pre}mock/dtd`, title: 'DTD 规则' }
        ]
      },
      {
        path: `${pre}import`,
        title: '导入',
        icon: 'download',
        children: [
          { path: `${pre}import/csv`, title: 'csv' },
          { path: `${pre}import/xlsx`, title: 'xlsx' }
        ]
      },
      {
        path: `${pre}export`,
        title: '导出',
        icon: 'upload',
        children: [
          { path: `${pre}export/table`, title: '表格' },
          { path: `${pre}export/txt`, title: '文本' }
        ]
      },
      {
        path: `${pre}better-scroll`,
        title: '滚动扩展',
        icon: 'crosshairs',
        children: [
          { path: `${pre}better-scroll/base`, title: '基础用法' },
          { path: `${pre}better-scroll/to`, title: '滚动定位' }
        ]
      },
      { path: `${pre}clipboard-polyfill`, title: '剪贴板访问', icon: 'clipboard' },
      { path: `${pre}day`, title: '日期计算', icon: 'clock-o' },
      { path: `${pre}js-cookie`, title: 'Cookie 读写', icon: 'asterisk' }
    ])('/project-management/')
  }
]
