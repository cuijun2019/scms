<template>
  <div class="d2-layout-header-aside-group" :style="styleLayoutMainGroup" :class="{grayMode: grayActive}">
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div class="d2-theme-header" :style="{ opacity: this.searchActive ? 0.5 : 1 }" flex-box="0" flex>
        <router-link to="/index" class="logo-group" :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}" flex-box="0">
          <!--<img v-if="asideCollapse" :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`">-->
          <!--<img v-else :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`">-->
          <i v-if="asideCollapse"  class="el-icon-s-shop"></i>
          <span v-else >协议供货管理系统</span>

        </router-link>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <d2-icon name="bars"/>
        </div>
        <!--<d2-menu-header flex-box="1"/>-->
        <d2-Layout-header-menu flex-box="1" :headerMenuArray="headerMenuArray"/>
        <!-- 顶栏右侧 -->
        <div class="d2-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <!--<d2-header-search @click="handleSearchClick"/>-->
          <d2-header-log/>
          <!--<d2-header-theme/>-->
          <d2-header-user/>
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div flex-box="0" ref="aside" class="d2-theme-container-aside" :style="{ width: asideCollapse ? asideWidthCollapse : asideWidth, opacity: this.searchActive ? 0.5 : 1 }">
          <d2-menu-side />
        </div>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="d2-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="d2-theme-container-main-header" flex-box="0">
                <d2-tabs/>
              </div>
              <!-- 页面 -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import d2LayoutHeaderMenu from './components/header-button'
import d2MenuSide from './components/menu-side'
import d2Tabs from './components/tabs'
import d2HeaderUser from './components/header-user'
import d2HeaderLog from './components/header-log'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
export default {
  name: 'd2-layout-header-aside',
  mixins: [
    mixinSearch
  ],
  components: {
    d2LayoutHeaderMenu,
    d2MenuSide,
    d2Tabs,
    d2HeaderUser,
    d2HeaderLog
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px',
      headerMenuArray: []
    }
  },
  created () {
    console.log('====父组件')
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse
    }),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup () {
      return this.themeActiveSetting.backgroundImage
        ? { backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')` }
        : {}
    }
  },
  methods: {
    ...mapActions('d2admin/menu', [
      'asideCollapseToggle',
      'menuListSet'
    ]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside () {
      this.asideCollapseToggle()
    },
    getHederMenu (menuArray) {
      this.headerMenuArray = []
      menuArray.forEach(item => {
        this.headerMenuArray.push({
          name: item.alias,
          id: item.id
        })
      })
    }
  }
}
</script>

<style lang="scss">
// 注册主题
@import '~@/assets/style/theme/register.scss';
</style>
