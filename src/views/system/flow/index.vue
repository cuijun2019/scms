<template>
  <div class="flow-container">
    <div class="flow-menu">
      <div>
        <p class="flow-menu-title">工具</p>
        <div class="flow-menu-container">
          <div class="menu-item" @click="isConnect=false">
            <i class="el-icon-rank flow-icon"></i>
            <span>选择</span>
          </div>
          <div class="menu-item" @click="isConnect=true">
            <i class="el-icon-bottom-right flow-icon"></i>
            <span>连线</span>
          </div>
        </div>
      </div>
      <div>
        <p class="flow-menu-title">节点</p>
        <div class="flow-menu-container">
          <div class="menu-item menu-item-move" v-for="item in menuList" :draggable="item.isDraggable" @dragstart="drag(item)">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
      <div>
        <p class="flow-menu-title">流程模板</p>
        <div class="flow-menu-container">
          <p>供应商业务流程</p>
          <p>协议供货业务流程</p>
        </div>
      </div>
    </div>
    <div class="flow-detail">
      <div class="flow-main-menu">
        <div class="tool-right">
          <el-tooltip content="撤销">
            <i class="el-icon-refresh-left tool-icon"
               :disabled="isUndoDisable"
               @click="undo"
               circle></i>
          </el-tooltip>
          <el-tooltip content="放大">
            <i class="el-icon-zoom-in tool-icon"
               @click="zoomOut"
               circle></i>
          </el-tooltip>
          <el-tooltip content="缩小">
            <i class="el-icon-zoom-out tool-icon"
               @click="zoomIn"
               circle></i>
          </el-tooltip>
          <!--<el-tooltip content="自动布局">-->
            <!--<i class="el-icon-bangzhu tool-icon"-->
               <!--circle></i>-->
          <!--</el-tooltip>-->
          <!-- <el-tooltip content="适应画布">
            <el-button icon="el-icon-money"
                       circle></el-button>
          </el-tooltip> -->
          <!--<el-tooltip content="全屏">-->
            <!--<i class="el-icon-full-screen tool-icon"-->
               <!--circle></i>-->
          <!--</el-tooltip>-->
        </div>
        <el-button type="primary" size="mini" @click="saveData()">保 存</el-button>
      </div>
      <div id="flowContent"
           ref="flowContent"
           @drop="drop($event)"
           @dragover="allowDrop($event)"
           @click="editFlow()"
           @dblclick="isConnect=false">
        <flowNode v-for="node in data.nodeList" :key="node.id"
                  :node="node"
                  :id="node.id"
                  :isconnect="isConnect"
                  @delete-node="deleteNode"
                  @change-node-site="changeNodeSite"
                  @edit-node="editNode">
        </flowNode>
      </div>
    </div>
    <div class="flow-edit">
      <div class="flow-edit-content">
        <edit-flow ref="flowEdit" v-show="editType=='flow'"></edit-flow>
        <edit-node ref="nodeForm" v-show="editType=='node'"></edit-node>
        <edit-line ref="lineForm" v-show="editType=='line'" @line-save="lineLabelSave"></edit-line>
      </div>
    </div>

  </div>
</template>

<script>

import { jsPlumb } from 'jsplumb'
import flowNode from './components/flowNode.vue'
import editFlow from './components/editFlow.vue'
import editNode from './components/editNode.vue'
import editLine from './components/editLine.vue'
import panZoom from './FlowChart/moveAndZoom'

let chartObj = {
  flowInfo: {
    Id: '67b2dcc8-066f-4367-b0f7-cc677be66fe9',
    Name: '我的流程',
    Remark: ''
  },
  nodeList: [
    {
      id: '7979c7d4-dd00-4f40-8c81-e40f687e89c5',
      label: '开始',
      top: '67px',
      left: '292px',
      Type: 1
    },
    {
      id: '076dfa1a-ed78-4991-91f0-3d629803cf8f',
      label: '人工活动',
      top: '344px',
      left: '331px',
      Type: 3
    },
    {
      id: 'a50a9637-ef58-463c-b15d-1ec1797b2d88',
      label: '结束',
      top: '550px',
      left: '258px',
      Type: 2
    }
  ],
  lineList: [
    {
      from: '7979c7d4-dd00-4f40-8c81-e40f687e89c5',
      to: '076dfa1a-ed78-4991-91f0-3d629803cf8f',
      label: '连线名称',
      id: '2b81ec81-c067-4bd7-971e-9c73dae20b70',
      Remark: ''
    },
    {
      from: '076dfa1a-ed78-4991-91f0-3d629803cf8f',
      to: 'a50a9637-ef58-463c-b15d-1ec1797b2d88',
      label: '连线名称',
      id: 'f39402c8-5595-40ec-969f-d395730ccf05',
      Remark: ''
    }
  ]
}
export default {
  name: 'flow-main',
  data () {
    return {
      isUndoDisable: false,
      menuList: [
        {
          type: 1,
          name: '开始',
          icon: 'circle-start-legend',
          isDraggable: true
        },
        {
          type: 3,
          name: '人工活动',
          icon: 'rectangle-legend',
          isDraggable: true
        },
        {
          type: 4,
          name: '条件',
          icon: 'diamond-legend',
          isDraggable: true
        },
        {
          type: 2,
          name: '完成',
          icon: 'circle-end-legend',
          isDraggable: true
        }
      ],
      jsPlumb: null, // jsPlumb 实例
      index: 1,
      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter',
          'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
        ],
        Container: 'flowContent',
        // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
        Connector: 'Straight',
        // 这个是鼠标拉出来的线的属性
        ConnectionOverlays: [
          ['Label', {
            label: '连线文本',
            id: 'label-1',
            cssClass: 'connect-line'
          }]
        ],
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: ['Rectangle', {
          height: 10,
          width: 10
        }],
        // 线端点的样式
        EndpointStyle: {
          fill: 'rgba(255,255,255,0)',
          outlineWidth: 1
        },
        LogEnabled: true, // 是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: {
          stroke: '#000',
          strokeWidth: 2
        },
        // 绘制箭头
        Overlays: [
          ['Arrow', {
            width: 8,
            length: 8,
            location: 1
          }]
        ],
        RenderMode: 'svg'
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: 'AutoDefault'
      },
      jsplumbSourceOptions: {
        filter: '.flow-node-drag', // 触发连线的区域
        /* "span"表示标签，".className"表示类，"#id"表示元素id */
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        filter: '.flow-node-drag',
        /* "span"表示标签，".className"表示类，"#id"表示元素id */
        filterExclude: false,
        anchor: 'Continuous',
        allowLoopback: false
      },
      // 是否加载完毕
      loadEasyFlowFinish: false,
      // 数据
      // data: {
      //   flowInfo: {
      //     Id: this.getUUID(),
      //     Name: '我的流程',
      //     Remark: '',
      //   },
      //   nodeList: [],
      //   lineList: []
      // },
      data: chartObj,
      currentItem: '', // 临时存添加的元素
      isConnect: false, // 判断是否连接
      timer: null, // 定时器,判断单双击,
      currentConnect: '', // 当前的连接线
      currentLine: '', // 当前连接线数据
      editType: '' // 编辑的类型
    }
  },
  components: {
    flowNode,
    editFlow,
    editNode,
    editLine
  },
  created () {},
  mounted () {
    this.jsPlumb = jsPlumb.getInstance()
    this.jsPlumb.setContainer('flowContent')
    this.$nextTick(() => {
      this.init()
    })
    this.editFlow()
  },
  methods: {
    init () {
      const _this = this
      this.jsPlumb.ready(function () {
        // 导入默认配置
        _this.jsPlumb.importDefaults(_this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        _this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        _this.loadEasyFlow()

        // 单点连接线（编辑label）,
        _this.jsPlumb.bind('click', function (conn, originalEvent) {
          // clearTimeout(this.timer);
          // this.timer = setTimeout(function () { // 这里采用执行自定义事件的方式
          //    console.log("click", conn);
          //    _this.editLine(conn);
          // }, 300); // 延迟300ms执行单击事件,区分双击事件
          console.log('click', conn)
          _this.editLine(conn)
          console.log(conn.getOverlay('label-1'))
          // conn.getOverlay("label-1").setLabel('大肥肚'); //初始化label
        })
        // 双击连接线（删除）,
        _this.jsPlumb.bind('dblclick', function (conn, originalEvent) {
          clearTimeout(this.timer)
          console.log('dblclick', conn)

          _this.$confirm('确定删除所点击的线吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.jsPlumb.deleteConnection(conn)
          }).catch(() => { })
        })
        // 连线
        _this.jsPlumb.bind('connection', function (evt) {
          console.log('connection', evt)
          let from = evt.source.id
          let to = evt.target.id
          if (_this.loadEasyFlowFinish) {
            _this.data.lineList.push({
              from: from,
              to: to,
              label: '连线名称',
              id: _this.getUUID(),
              Remark: ''
            })
          };
          setTimeout(function () {
            _this.editLine(evt.connection)
          }, 100)
        })

        // 删除连线
        _this.jsPlumb.bind('connectionDetached', function (evt) {
          console.log('connectionDetached', evt)
          _this.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接节点
        _this.jsPlumb.bind('connectionMoved', function (evt) {
          console.log('connectionMoved', evt)
          _this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 单击endpoint
        // jsPlumb.bind("endpointClick", function (evt) {
        //   console.log('endpointClick', evt)
        // })
        //
        // // 双击endpoint
        // jsPlumb.bind("endpointDblClick", function (evt) {
        //   console.log('endpointDblClick', evt)
        // })

        // contextmenu 右键
        _this.jsPlumb.bind('contextmenu', function (evt) {
          console.log('contextmenu', evt)
        })

        // beforeDrop
        _this.jsPlumb.bind('beforeDrop', function (evt) {
          console.log('beforeDrop', evt)
          let from = evt.sourceId
          let to = evt.targetId
          if (from === to) {
            _this.$message.error('不能连接自己')
            return false
          }
          if (_this.hasLine(from, to)) {
            _this.$message.error('不能重复连线')
            return false
          }
          if (_this.hashOppositeLine(from, to)) {
            _this.$message.error('不能回环哦')
            return false
          }
          return true
        })

        // beforeDetach
        _this.jsPlumb.bind('beforeDetach', function (evt) {
          console.log('beforeDetach', evt)
        })
      })
      panZoom.init(this.jsPlumb)
      this.data.nodeList.forEach(item => {
        if (item.Type === 1) {
          this.menuList[0].isDraggable = false
        }
      })
    },
    // 加载流程图
    loadEasyFlow () {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        // jsPlumb.addEndpoint(node.id)
        // 设置可拖拽
        // jsPlumb.draggable(node.id, {
        //     containment: 'parent',
        //     grid: [10, 10]
        // })

        this.jsPlumb.draggable(node.id, {
          containment: 'parent'
        })

        // jsPlumb.draggable(node.id)
      }

      // 初始化连线
      for (let i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i]
        let connection = this.jsPlumb.connect({
          source: line.from,
          target: line.to
        }, this.jsplumbConnectOptions)

        connection.getOverlay('label-1').setLabel(line.label) // 初始化label
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
      })
    },
    // 添加新的节点
    addNode (temp) {
      console.log('添加节点', temp)
      console.log( this.data.nodeList)
      this.data.nodeList.push(temp)
      this.data.nodeList.forEach(item => {
        if (item.Type === 1) {
          this.menuList[0].isDraggable = false
        }
      })
      console.log(3, this.data.nodeList)

      this.$nextTick(function () {
        this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(temp.id, {
          containment: 'parent'
        })
      })
    },
    // 删除线
    deleteLine (from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        return line.from !== from && line.to !== to
      })
    },
    // 改变连线
    changeLine (oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变节点的位置
    changeNodeSite (data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    // 删除节点
    deleteNode (node) {
      this.$confirm('确定要删除节点' + node.id + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // this.data.nodeList = this.data.nodeList.filter(function(node) {
        // 	if (node.id === nodeId) {
        // 		node.show = false
        // 	}
        // 	return true
        // })
        this.data.nodeList.forEach((item, index) => {
          if (item.id === node.id) {
            this.data.nodeList.splice(index, 1)
          }
        })
        if (node.Type === 1) {
          this.menuList[0].isDraggable = true
        }
        this.$nextTick(function () {
          console.log('删除' + node.id)
          this.jsPlumb.removeAllEndpoints(node.id)
        })
      }).catch(() => {})
      return true
    },
    // 编辑节点
    editNode (nodeId) {
      // console.log('编辑节点', nodeId)
      this.editType = 'node'
      this.$nextTick(function () {
        this.$refs.nodeForm.init(this.data, nodeId)
      })
    },
    editLine (conn) {
      var _this = this
      _this.currentConnect = conn
      _this.data.lineList.forEach(function (item, index) {
        if (item.from == conn.sourceId && item.to == conn.targetId) {
          _this.currentLine = item
          _this.editType = 'line'
          _this.$nextTick(function () {
            _this.$refs.lineForm.init(item)
          })
        }
      })
    },
    // 删除线
    delLine (conn) {
      this.$confirm('确定删除所点击的线吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.jsPlumb.deleteConnection(conn)
      }).catch(() => {})
    },
    // 是否具有该线
    hasLine (from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine (from, to) {
      return this.hasLine(to, from)
    },
    lineLabelSave (line) {
      this.currentConnect.getOverlay('label-1').setLabel(line.label)
      // this.$set(this.currentLine, 'label', line.label);
    },
    drag (item) {
      this.currentItem = item
    },
    drop (event) {
      // event.preventDefault();
      var _obj = this.$refs.flowContent
      var temp = {
        id: this.getUUID(),
        label: this.currentItem.name,
        top: event.offsetY + 'px',
        left: event.offsetX + 'px',
        Type: this.currentItem.type
      }
      this.addNode(temp)
      this.editNode(temp.id)
    },
    allowDrop (event) {
      event.preventDefault()
    },
    getUUID () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    },
    /**
     * @description 放大画布
     */
    zoomOut () {
      const x = this.jsPlumb.mainContainerWrap.clientWidth / 2
      const y = this.jsPlumb.mainContainerWrap.clientHeight / 2
      this.jsPlumb.pan.smoothZoom(x, y, 1.2)
    },
    /**
     * @description  缩小画布
     */
    zoomIn  () {
      const x = this.jsPlumb.mainContainerWrap.clientWidth / 2
      const y = this.jsPlumb.mainContainerWrap.clientHeight / 2
      this.jsPlumb.pan.smoothZoom(x, y, 0.8)
    },

    undo () {
      // FlowChart.undo()
    },
    saveData () {
      // console.log(this.jsPlumb)
      // console.log(this.jsPlumb.Defaults)
      // console.log('线', this.jsPlumb.getConnections())
      console.log(this.data)
    },
    editFlow () {
      this.editType = 'flow'
      this.$nextTick(function () {
        this.$refs.flowEdit.init(this.data.flowInfo)
      })
    }
  }
}
</script>

<style  lang="scss">
  @import '~@/assets/style/flow/jsplumb-custom.scss';

</style>
