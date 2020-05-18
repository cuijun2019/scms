// Vue
import Vue from 'vue'
import { mapState } from 'vuex'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'
// xlsx
import XLSX from 'xlsx'

// 菜单和路由设置
import router from './router'
import { frameInRoutes } from '@/router/routes'
import * as global_ from './libs/vue.global'

// 核心插件
Vue.use(d2Admin)
Vue.use(XLSX)
Vue.prototype.GLOBAL = global_
new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
  },
  computed: {
    ...mapState('d2admin/menu', [
      'menuData',
      'currentMenu'
    ])
  },
  mounted () {
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          if (this.menuData) {
            if (matched[0].path === '') { // 首页处理
              const _side = this.menuData.filter(menu => menu.path === this.menuData[0].path)
              this.$store.dispatch('d2admin/menu/headerActivePathSet', _side[0].path)
              this.$store.commit('d2admin/menu/asideSet', _side)
              if (this.menuData[0].path === '/index') {
                this.$router.push({ path: this.menuData[0].path })
              } else {
                this.$router.push({ path: this.menuData[0].children[0].path })
              }
            } else {
              const _side = this.menuData.filter(menu => menu.path === matched[0].path)
              if (_side.length) {
                this.$store.dispatch('d2admin/menu/headerActivePathSet', _side[0].path)
                this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side : [])
              }
            }
          }
        }
      },
      immediate: true
    }
  }
}).$mount('#app')
