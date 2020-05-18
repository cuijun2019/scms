import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/template',
  name: 'template',
  meta,
  redirect: { path: '/template' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'purchase', name: `${pre}purchase`, component: _import('system/template/purchase/list'), meta: { ...meta, title: '采购结果通知书模板' } },
    { path: 'purchase-add', name: `${pre}purchase-add`, component: _import('system/template/purchase/add'), meta: { ...meta, title: '新建采购结果通知书模板' } },
    { path: 'purchase-edit', name: `${pre}purchase-edit`, component: _import('system/template/purchase/edit'), meta: { ...meta, title: '编辑采购结果通知书模板' } },
    { path: 'bids', name: `${pre}bids`, component: _import('system/template/bids/list'), meta: { ...meta, title: '成交通知书模板' } },
    { path: 'bids-add', name: `${pre}bids-add`, component: _import('system/template/bids/add'), meta: { ...meta, title: '新建成交通知书模板' } },
    { path: 'bids-edit', name: `${pre}bids-edit`, component: _import('system/template/bids/edit'), meta: { ...meta, title: '编辑成交通知书模板' } },
    { path: 'contract', name: `${pre}contract`, component: _import('system/template/contract/list'), meta: { ...meta, title: '合同模板' } },
    { path: 'contract-add', name: `${pre}contract-add`, component: _import('system/template/contract/add'), meta: { ...meta, title: '新建合同模板' } },
    { path: 'contract-edit', name: `${pre}contract-edit`, component: _import('system/template/contract/edit'), meta: { ...meta, title: '编辑合同模板' } }
  ])('template-')
}
