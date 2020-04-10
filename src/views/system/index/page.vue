<!--suppress ALL -->
<template>
  <d2-container class="page">
    <div class="scms-container">
      <div class="todo-container container-shadow">
        <div class="header-list">
          <p class="title">我的待办</p>
          <div>
            <el-radio-group v-model="type" size="mini">
              <el-radio-button :label="item.id" v-for="item in todoTypeArray">{{item.name}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="table-container">
          <el-table
            :loading="loading"
            border
            size="mini"
            :row-class-name="tableRowClassName"
            :data="data">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
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
          </el-table>
          <div class="table-paging">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="project-container container-shadow">
        <div class="header-list">
          <p class="title">我的项目</p>
          <div>
            <el-radio-group v-model="type" size="mini">
              <el-radio-button :label="item.id" v-for="item in todoTypeArray">{{item.name}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="table-container">
          <el-table
            :loading="loading"
            border
            size="mini"
            :row-class-name="tableRowClassName"
            :data="data">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
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
          </el-table>
          <div class="table-paging">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
// import D2Badge from './components/d2-badge'
// import D2Help from './components/d2-help'
// import D2PageCover from './components/d2-page-cover'
export default {
  components: {
    // D2Badge,
    // D2Help,
    // D2PageCover
  },
  data () {
    return {
      filename: __filename,
      todoTypeArray:[
        {
          name:'待办',
          id:1,
        },
        {
          name:'已办',
          id:2,
        },
        {
          name:'待阅',
          id:3,
        },
        {
          name:'已阅',
          id:4,
        }
      ],
      type:1,
      columns: [
        {
          title: '日期',
          key: 'date',
          width: '180'
        },
        {
          title: '姓名',
          key: 'name',
          width: '180'
        },
        {
          title: '地址',
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
      currentPage4:1,
      projectTypeArray:[
        {
          name:'审核中',
          id:1,
        },
        {
          name:'已完成',
          id:2,
        },
        {
          name:'已退回',
          id:3,
        }
      ],
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'even-row';
      }else {
        return 'odd-row';
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
}
</script>
<style>

</style>

<style lang="scss" scoped>
.page {
  .scms-container {
    margin: 15px;
    .header-list{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
        border-left: 3px solid #559cf1;
        padding-left: 5px;
      }
    }

    .todo-container{
      background: #fff;
      padding: 10px;
      margin-bottom: 10px;
    }
    .project-container{
      background: #fff;
      padding: 10px;
      margin-top: 15px;
    }
  }

}
</style>
