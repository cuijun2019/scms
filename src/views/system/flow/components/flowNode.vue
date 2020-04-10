<template>
    <div class="flow-node-item"
         ref="node"
         :style="flowNodeContainer"
         @mouseenter="showDelete"
         @mouseleave="hideDelete"
         @mouseup="changeNodeSite"
         @click.stop="editNode">
        <div class="flow-node-con">
          <i :class="iconClass" class="type-icon"></i>
          <span class="flow-icon-text">{{node.label}}</span>
        </div>
        <div class="flow-node-del" v-show="mouseEnter" @click.stop="deleteNode">
          <i class="el-icon-circle-close"></i>
        </div>

        <!--连线用--//触发连线的区域-->
        <div class="flow-node-drag" v-show="isconnect"></div>
    </div>
</template>

<script>
export default {
  props: {
    node: Object,
    isconnect: Boolean
  },
  data () {
    return {
      mouseEnter: false
    }
  },
  computed: {
    // 节点容器样式
    flowNodeContainer: {
      get () {
        return {
          position: 'absolute',
          // minWidth: '80px',
          top: this.node.top,
          left: this.node.left,
          // boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 12px 0px' : ''
        }
      }
    },
    iconClass () {
      if (this.node.Type === 1) {
        return 'circle-start'
      } else if (this.node.Type === 2) {
        return 'circle-end'
      } else if (this.node.Type === 3) {
        return 'rectangle'
      } else if (this.node.Type === 4) {
        return 'diamond'
      }
    }
  },
  methods: {
    // 删除节点
    deleteNode () {
      this.$emit('delete-node', this.node)
    },
    // 编辑节点
    editNode () {
      this.$emit('edit-node', this.node.id)
    },
    // 鼠标进入
    showDelete () {
      this.mouseEnter = true
    },
    // 鼠标离开
    hideDelete () {
      this.mouseEnter = false
    },
    // 鼠标移动后抬起
    changeNodeSite () {
      this.$emit('changeNodeSite', {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      })
    }
  }
}
</script>
<style>

</style>
