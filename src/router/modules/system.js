import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: false }

export default {
  path: '/system',
  name: 'system',
  meta,
  redirect: { path: '/system/user' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'user', name: `${pre}user`, component: _import('system/system/user/list'), meta: { ...meta, title: '用户管理' } },
    { path: 'user-add', name: `${pre}user-add`, component: _import('system/system/user/add'), meta: { ...meta, title: '新建用户' } },
    { path: 'user-edit', name: `${pre}user-edit`, component: _import('system/system/user/edit'), meta: { ...meta, title: '编辑用户' } },
    { path: 'role', name: `${pre}role`, component: _import('system/system/role/list'), meta: { ...meta, title: '角色管理' } },
    { path: 'role-add', name: `${pre}role-add`, component: _import('system/system/role/add'), meta: { ...meta, title: '新建角色' } },
    { path: 'role-edit', name: `${pre}role-edit`, component: _import('system/system/role/edit'), meta: { ...meta, title: '编辑角色' } },
    { path: 'menu', name: `${pre}menu`, component: _import('system/system/menu/list'), meta: { ...meta, title: '菜单管理' } }
  ])('system-')
}
