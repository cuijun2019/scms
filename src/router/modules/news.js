import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: false }

export default {
  path: '/index',
  name: 'index',
  meta,
  redirect: { path: '/index' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'todo', name: `${pre}todo`, component: _import('system/news/todo'), meta: { ...meta, title: '待办' } },
    { path: 'done', name: `${pre}done`, component: _import('system/news/done'), meta: { ...meta, title: '已办' } }
    // { path: 'pending', name: `${pre}pending`, component: _import('system/news/pending'), meta: { ...meta, title: '待阅' } },
    // { path: 'read', name: `${pre}read`, component: _import('system/news/read'), meta: { ...meta, title: '已阅' } }
  ])('news-')
}
