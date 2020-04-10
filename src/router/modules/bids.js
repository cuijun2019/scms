import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: false }

export default {
  path: '/bids',
  name: 'bids',
  meta,
  redirect: { path: '/bids/list' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'list', name: `${pre}list`, component: _import('system/bids/list'), meta: { ...meta, title: '我的成交通知书' } }
  ])('bids-')
}
