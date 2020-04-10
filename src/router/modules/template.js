import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: false }

export default {
  path: '/template',
  name: 'template',
  meta,
  redirect: { path: '/template/purchase' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'purchase', name: `${pre}purchase`, component: _import('system/template/purchase/list'), meta: { ...meta, title: '采购结果通知书模板' } },
    { path: 'bids', name: `${pre}bids`, component: _import('system/template/bids/list'), meta: { ...meta, title: '中标通知书模板' } },
    { path: 'contract', name: `${pre}contract`, component: _import('system/template/contract/list'), meta: { ...meta, title: '合同模板' } }
  ])('template-')
}
