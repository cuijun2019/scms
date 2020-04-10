import { uniqueId } from 'lodash'
// 设置文件
import setting from '@/setting.js'

/**
 * 给菜单数据补充上 path 字段
 * https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementMenuPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementMenuPath(e.children)
    } : {}
  }))
}

export default {
  namespaced: true,
  state: {
    menuData: [],
    headerActivePath: '/news',
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse,
    // 侧边栏的选中
    asideNavNum: ''
  },
  getters: {
    /**
     * @description 返回header当前选中模块index
     * @param {number} state state
     */
    getHeaderActiveNum (state) {
      return state.headerActiveNum
    },
    /**
     * @description 返回菜单列表数据
     * @param {Array} state state
     */
    getMenuData: (state) => {
      return state.menuData
    }
  },
  actions: {
    /**
     * 设置侧边栏展开或者收缩
     * @param {Object} context
     * @param {Boolean} collapse is collapse
     */
    asideCollapseSet ({ state, dispatch }, collapse) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = collapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 切换侧边栏展开和收缩
     * @param {Object} context
     */
    asideCollapseToggle ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = !state.asideCollapse
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          value: state.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     * @param {Object} context
     */
    asideCollapseLoad ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.asideCollapse = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.asideCollapse',
          defaultValue: setting.menu.asideCollapse,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description 持久化存储所有的菜单值
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    menuDataSet ({ state, dispatch }, menu) {
      return new Promise(async resolve => {
        // store 赋值
        state.menuData = menu
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.menuData',
          value: state.menuData,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * 从持久化数据读取存储的菜单值
     * @param {Object} context
     */
    menuDataLoad ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.menuData = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.menuData',
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },

    /**
     * @description 持久化存储所有的菜单值
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerActivePathSet ({ state, dispatch }, path) {
      return new Promise(async resolve => {
        // store 赋值
        state.headerActivePath = path
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'menu.headerActivePath',
          value: state.headerActivePath,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
 * 从持久化数据读取存储的菜单值
 * @param {Object} context
 */
    headerActivePathLoad ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.headerActivePath = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'menu.headerActivePath',
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  },
  mutations: {
    /**
     * @description 存储当前的菜单值
     * @param {Object} state state
     * @param {Array} currentMenu currentMenu setting
     */
    currentMenuSet (state, currentMenu) {
      state.currentMenu = currentMenu
    },
    /**
     * @description 设置顶栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store 赋值
      state.header = supplementMenuPath(menu)
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store 赋值
      state.aside = supplementMenuPath(menu)
    },
    /**
     * @description 设置侧边栏菜单选中
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideNavNumSet (state, asideNavNum) {
      // store 赋值
      state.asideNavNum = asideNavNum
    }
  }
}
