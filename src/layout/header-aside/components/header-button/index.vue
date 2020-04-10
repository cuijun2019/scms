
<template>
  <div class="header-btn">
    <ul class="header-ul">
      <li v-for="(item, index) in menuData" :class="(headerActivePath == item.path) ? 'active' :''" @click="handleChangeMenu(item, index)">{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'd2-layout-header-menu',
  props: {
    headerMenuArray: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isActive: 0
    }
  },
  created () {
    console.log('===子组件')
  },
  computed: {
    ...mapState('d2admin/menu', [
      'menuData',
      'headerActivePath'
    ])
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    // menuData: {
    //   handler (val) {
    //     if (val.length) {
    //       this.$store.commit('d2admin/menu/asideSet', [val[0]])
    //     }
    //   },
    //   immediate: true
    // }
  },
  methods: {
    handleChangeMenu (item, idx) {
      this.$store.dispatch('d2admin/menu/headerActivePathSet', item.path)
      this.$router.push({ path: item.path })
    }
  }
}
</script>

<style lang="scss">
  ul{
    padding: 0;
    margin: 0;
  }
li{
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.header-btn{
  display: flex;
  align-items: center;
  .header-ul{
    display: flex;
    li{
      color: #666666;
      cursor: pointer;
      padding: 5px 15px;
      border-radius: 20px;
    }
  }
}
  .active{
    color: #fff !important;
    background: #3B9DF8;
  }
</style>
