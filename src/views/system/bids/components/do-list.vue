<template>
  <div>
    <div class="list-wrapper">
      <!--<div class="list-header">-->
      <!--<span class="list-header-title">已办列表</span>-->
      <!--</div>-->
      <div class="list-search">
        <div class="search-container">
          <el-collapse v-model="activeNames">
            <el-collapse-item  name="1">
              <template slot="title">
                <i class="search-icon"></i>
                <span class="search-title">查询条件</span>
              </template>
              <div class="search-container">
                <!--<p class="search-title">列表检索条件</p>-->
                <div class="search-content">
                  <ul class="search-con">
                    <li class="search-item">
                      <label>询价方案主题:</label>
                      <el-select class="search-input" v-model="value" clearable placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </li>
                    <li class="search-item">
                      <label>方案主题:</label>
                      <el-select class="search-input" v-model="value" clearable placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </li>
                  </ul>
                  <div class="search-btn">
                    <el-button class="basic-btn" size="mini">查询</el-button>
                    <el-button class="clear-btn" size="mini">清空</el-button>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="table-container">
        <div class="table-tool">
          <div class="table-tool-title">
            <i class="list-icon"></i>
            <span class="list-title">列表</span>
          </div>
          <div class="table-tool-btn">
            <el-button class="tool-basic-btn" size="mini" v-show="listParams.type===1">新建</el-button>
            <el-button class="tool-export-btn" size="mini">导出</el-button>
          </div>
        </div>
        <el-table
          :loading="loading"
          border
          size="mini"
          :row-class-name="tableRowClassName"
          :data="data">
          <el-table-column
            fixed
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column v-for="(val, k) in columns"
                           :prop="val.key"
                           :label="val.title"
                           :width="val.width"
                           :column-key="val.key">
          </el-table-column>
          <el-table-column label="操作"  width="150">
            <template slot-scope="scope">
              <div v-if="listParams.type === 1">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">发送中标通知书</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"> 查看关联方案</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </div>
              <div v-else-if="listParams.type === 2">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"> 查看关联方案</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-paging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </div>
    </div>
    <modify-box :dialogVisible="dialogVisible" :boxParams="boxParams"/>
  </div>
</template>

<script>
import modifyBox from './modify-box'
export default {
  name: 'do-list',
  components: {
    modifyBox
  },
  props: {
    listParams: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      name: '',
      filename: '',
      activeNames: ['1'],
      typeArray: ['待处理方案', '已处理方案', '查看方案列表'],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      value: '',
      columns: [
        {
          title: '状态',
          key: 'date'
        },
        {
          title: '中标通知书主题',
          key: 'date'
        },
        {
          title: '中标通知书',
          key: 'name'
        },
        {
          title: '中标供应商',
          key: 'address'
        },
        {
          title: '抄送人',
          key: 'name'
        },
        {
          title: '关联方案',
          key: 'address'
        },
        {
          title: '产品分类',
          key: 'address'
        }, {
          title: '产品名称',
          key: 'address'
        }, {
          title: '产品型号',
          key: 'address'
        },
        {
          title: '产品描述',
          key: 'address'
        }, {
          title: '采购人',
          key: 'address'
        }, {
          title: '创建人',
          key: 'address'
        },
        {
          title: '创建时间',
          key: 'address'
        }
      ],
      data: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      loading: false,
      currentPage: 1,
      boxParams: {},
      dialogVisible: false
    }
  },
  created () {
  },
  filters: {},
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
        }
      }

    }

  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    handleEdit (index, row) {
      console.log(index, row)
      this.dialogVisible = !this.dialogVisible
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss">

</style>
