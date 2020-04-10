<!--suppress ALL -->
<template>
  <d2-container class="page">
    <main-form flex-box="1"  :listParams="listParams"/>
  </d2-container>
</template>

<script>
  import mainForm from './components/main-form'
  export default {
    name: 'goods-edit',
    components: {
      mainForm
    },
    data () {
      return {
        filename: __filename,
        listParams:{
          type:2
        }
      }
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>

</style>
