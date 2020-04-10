import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: false }

export default {
  path: '/goods',
  name: 'goods',
  meta,
  redirect: { path: '/goods/list' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'list', name: `${pre}list`, component: _import('system/goods/list'), meta: { ...meta, title: '我的货物' } },
    { path: 'add', name: `${pre}add`, component: _import('system/goods/add'), meta: { ...meta, title: '新建货物' } },
    { path: 'edit', name: `${pre}edit`, component: _import('system/goods/edit'), meta: { ...meta, title: '编辑货物' } },
    // { path: 'update', name: `${pre}update`, component: _import('system/supplier/update'), meta: { ...meta, title: '我的变更' } },
    // { path: 'reset-pwd', name: `${pre}reset-pwd`, component: _import('system/supplier/reset-pwd'), meta: { ...meta, title: '密码重置' } }
  ])('goods-')
}
