import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/supplier',
  name: 'supplier',
  meta,
  redirect: { path: '/supplier' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'list', name: `${pre}list`, component: _import('system/supplier/list'), meta: { ...meta, title: '供应商信息' } },
    { path: 'info', name: `${pre}info`, component: _import('system/supplier/info'), meta: { ...meta, title: '我的信息' } },
    { path: 'update', name: `${pre}update`, component: _import('system/supplier/update'), meta: { ...meta, title: '我的变更' } },
    { path: 'view', name: `${pre}view`, component: _import('system/supplier/view'), meta: { ...meta, title: '查看注册变更信息' } },
    { path: 'agent-view', name: `${pre}agent-view`, component: _import('system/supplier/agent-view'), meta: { ...meta, title: '查看代理商信息' } },
    { path: 'reset-pwd', name: `${pre}reset-pwd`, component: _import('system/supplier/reset-pwd'), meta: { ...meta, title: '密码重置' } }
  ])('supplier-')
}
