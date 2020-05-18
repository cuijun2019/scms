import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/prices',
  name: 'prices',
  meta,
  redirect: { path: '/prices' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'list', name: `${pre}list`, component: _import('system/prices/list'), meta: { ...meta, title: '我的询价记录' } },
    { path: 'add', name: `${pre}add`, component: _import('system/prices/add'), meta: { ...meta, title: '新建询价' } },
    { path: 'edit', name: `${pre}edit`, component: _import('system/prices/edit'), meta: { ...meta, title: '查看询价' } }
  ])('prices-')
}
