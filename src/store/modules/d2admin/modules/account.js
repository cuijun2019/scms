import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { AccountLogin } from '@api/sys.login'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login ({ dispatch }, {
      username = '',
      password = ''
    } = {}) {
      console.log('1111', username, password)
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        AccountLogin({
          username,
          password
        })
          .then(async res => {
            console.log('======login', res)
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天
            // util.cookies.set('uuid', res.uuid)
            util.cookies.set('uuid', 'admin-uuid')
            util.cookies.set('token', res)
            // 设置 vuex 用户信息
            await dispatch('d2admin/user/set', {
              name: username
            }, { root: true })

            // { path: '/flow',
            //   title: '流程管理',
            //   alias: '流程管理',
            //   icon: 'plug',
            //   id: 2,
            //   children: [
            //     { path: '/flow/main', title: '流程设计', icon: 'asterisk' },
            //     { path: '/flow/done', title: '已办', icon: 'clipboard' },
            //     { path: '/flow/pending', title: '待阅', icon: 'clock-o' },
            //     { path: '/flow/read', title: '已阅', icon: 'asterisk' }
            //   ]
            // },

            // 请求菜单数据并存储
            let menuData = [
              { path: '/index',
                title: '首页',
                alias: '首页',
                icon: 'home',
                id: 1,
                children: [
                  { path: '/index/todo', title: '待办', icon: 'DB' },
                  { path: '/index/done', title: '已办', icon: 'YB' },
                  { path: '/index/pending', title: '待阅', icon: 'DY' },
                  { path: '/index/read', title: '已阅', icon: 'YY' }
                ]
              },
              { path: '/projects',
                title: '项目管理',
                alias: '项目管理',
                icon: 'XMGL',
                id: 3,
                children: [
                  { path: '/projects/list', title: '我的项目', icon: 'WDXM' },
                ]
              },
              { path: '/goods',
                title: '货物管理',
                alias: '货物管理',
                icon: 'HWGL',
                id: 7,
                children: [
                  { path: '/goods/list', title: '我的货物', icon: 'WDHW' }
                ]
              },{ path: '/prices',
                title: '询价管理',
                alias: '询价管理',
                icon: 'XJGL',
                id: 4,
                children: [
                  { path: '/prices/list', title: '我的询价记录', icon: 'WDXJJJ' }
                ]
              },
              { path: '/supplier',
                title: '供应商管理',
                alias: '供应商管理',
                icon: 'GYSGL',
                id: 8,
                children: [
                  { path: '/supplier/list', title: '我的供应商', icon: 'WDGYS' },
                  { path: '/supplier/info', title: '我的信息', icon: 'WDXX' },
                  { path: '/supplier/update', title: '我的变更', icon: 'WDBG' },
                  { path: '/supplier/reset-pwd', title: '密码重置', icon: 'MMCZ' }
                ]
              },
              { path: '/agent',
                title: '代理商管理',
                alias: '代理商管理',
                icon: 'DLSGL',
                id: 9,
                children: [
                  { path: '/agent/list', title: '我的代理商', icon: 'WDDLS' }
                ]
              },
              { path: '/purchaseResults',
                title: '采购结果通知书',
                alias: '采购结果通知书',
                icon: 'CGJGTZS',
                id: 10,
                children: [
                  { path: '/purchaseResults/list', title: '我的采购结果通知书', icon: 'WDCGJJTZS' }
                ]
              },
              { path: '/bids',
                title: '成交通知书',
                alias: '成交通知书',
                icon: 'CJTZS',
                id: 5,
                children: [
                  { path: '/bids/list', title: '我的成交通知书', icon: 'WDCJTZS' }
                ]
              },
              { path: '/contract',
                title: '合同管理',
                alias: '合同管理',
                icon: 'HTGL',
                id: 6,
                children: [
                  { path: '/contract/list', title: '我的合同', icon: 'WDHT' }
                ]
              },
              { path: '/system',
                title: '系统管理',
                alias: '系统管理',
                icon: 'XTGL',
                id: 12,
                children: [
                  { path: '/system/user', title: '用户管理', icon: 'YHGL' },
                  { path: '/system/role', title: '角色管理', icon: 'JSGL' },
                ] },
              { path: '/template',
                title: '模板管理',
                alias: '模板管理',
                icon: 'MBGL',
                id: 13,
                children: [
                  { path: '/template/purchase', title: '采购结果通知书模板', icon: 'CGJJTZSMB' },
                  { path: '/template/bids', title: '成交通知书模板', icon: 'CHTZSMB' },
                  { path: '/template/contract', title: '合同模板', icon: 'HTMB' }
                ]
              }]
            await dispatch('d2admin/menu/menuDataSet', menuData, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load')
            // 结束
            resolve()
          })
          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: '取消注销操作'
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('d2admin/user/load', null, { root: true })
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch('d2admin/page/openedLoad', null, { root: true })
        // DB -> store 持久化数据加载存储的菜单值
        await dispatch('d2admin/menu/menuDataLoad', null, { root: true })
        // DB -> store 持久化数据加载存储的header当前选中模块index
        await dispatch('d2admin/menu/headerActivePathLoad', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // DB -> store 持久化数据加载全局尺寸
        await dispatch('d2admin/size/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('d2admin/color/load', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
