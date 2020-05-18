<!--suppress ALL -->
<template>
  <d2-container class="page">
    <div class="list-container">
      <div class="list-wrapper">
        <div class="list-search">
          <div class="search-container">
            <el-collapse v-model="activeNames">
              <el-collapse-item  name="1">
                <template slot="title">
                  <i class="search-icon"></i>
                  <span class="search-title">查询条件</span>
                </template>
                <div class="search-container">
                  <div class="search-content">
                    <ul class="search-con">
                      <li class="search-item">
                        <label>供应商名称:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请填写供应商名称"
                          v-model="searchData.supplierName"
                          clearable>
                        </el-input>
                      </li>
                    </ul>
                    <div class="search-btn">
                      <el-button class="basic-btn"  @click="fetchList">查询</el-button>
                      <el-button class="clear-btn"  @click="handleClear">清空</el-button>
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
            <div class="table-tool-btn" v-if="currentRouterData">
              <div class="btn-con" v-for="(item, index) in currentRouterData.menuBtn" >
                <el-button v-if="item.menuCode =='supplierCheck' " size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='supplierDelete'" size="mini" class="tool-delete-btn" @click="handleDelete">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='supplierExport'" size="mini" class="tool-export-btn" @click="handleExport">{{item.menuName}}</el-button>
              </div>
            </div>
          </div>
          <div class="table-wrapper">
            <el-table
              :loading="loading"
              border
              size="medium"
              :row-class-name="tableRowClassName"
              height="90%"
              :data="partnerInfoDtos"
              @selection-change="handleSelectionChange">
              <el-table-column
                fixed
                label="序号"
                type="index"
                align="center"
                width="50"
                :index="indexMethod">
              </el-table-column>
              <el-table-column
                fixed
                type="selection"
                align="center"
                width="55">
              </el-table-column>
              <el-table-column
                prop="companyNo"
                label="厂家名称"
                align="center"
                width="250">
              </el-table-column>
              <el-table-column
                prop="incorporator"
                label="法人代表"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="status"
                label="联系人"
                align="center">
              </el-table-column>
              <el-table-column
                prop="attachId"
                label="联系电话"
                width="250"
                align="center">
              </el-table-column>
              <el-table-column
                prop="creator"
                label="邮箱"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="detailAddress"
                label="邮寄地址"
                width="250"
                align="center">
              </el-table-column>
            </el-table>
            <div class="table-paging">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageInfo.currentPage"
                :page-sizes="GLOBAL.pageSizes"
                :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo.total">
              </el-pagination>
            </div>
          </div>

        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
  import {FetchSupplierInfo} from '@/api/sys.supplier'//api
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'supplier-list',
    components: {},
    data () {
      return {
        filename: __filename,
        activeNames: ['1'],
        options: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '厂家'
          }, {
            value: 2,
            label: '代理商'
          }],
        searchData:{
          supplierName:''
        },
        partnerInfoDtos: [],
        loading: false,
        pageInfo: {
          pageSize: this.GLOBAL.pageSize,
          total: 0,
          currentPage: 1
        },
        boxParams: {},
        dialogVisible: false,
        multipleSelection: []
      }
    },
    created () {
      this.fetchList()
    },
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/supplier/list'})
      })
    },
    computed: {
      ...mapState('d2admin/menu', [
        'currentRouterData'
      ])
    },
    methods: {
      ...mapActions('d2admin/page', [
        'closeRight'
      ]),
      handleClear () {
        this.searchData ={
          supplierName:''
        }
        this.fetchList()
      },
      indexMethod (index) {
        return index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      fetchList () {
        this.loading = true
        let searchParams ={}
        if(this.searchData.supplierName){
          searchParams.supplierName = this.searchData.supplierName
        }
        FetchSupplierInfo('get',Object.assign({
          Page: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.partnerInfoDtos = respondData.partnerInfoDtos;
            this.pageInfo = {
              ...this.pageInfo,
              total: respondData.statistics.totalSize,
              currentPage: respondData.statistics.currentPage
            }
            this.loading = false
          }
        }).catch((err) => {
          this.loading = false
          this.$message({
            message: err.message
          })
        })
      },
      tableRowClassName ({ row, rowIndex }) {
        if (rowIndex % 2 === 0) {
          return 'even-row'
        } else {
          return 'odd-row'
        }
      },
      formatter (row, column) {
        return  row.status === 1 ? '激活' : '冻结';
      },
      formatterTime (row, column) {
        if(column.property === 'maintenanceDate'){
          return  util.formatTime(row.maintenanceDate)
        }else if(column.property === 'createDate'){
          return  util.formatTime(row.createDate)
        }
      },
      handleEdit (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'supplier-view' , params: { partnerId: this.multipleSelection[0].partnerId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看/编辑的数据！'
          })
        }
      },
      handleDelete (index, row) {
        if(this.multipleSelection.length === 1){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          FetchSupplierInfo('delete',  this.multipleSelection[0].partnerId).then((res) => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.fetchList()

          }).catch((err) => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要删除的数据！'
          });
        }

      },
      /**
       * 改变分页size
       */
      handleSizeChange (val) {
        this.pageInfo = {
          ...this.pageInfo,
          pageSize: val
        }
        this.fetchList()
      },
      /**
       * 改变公页当前页
       */
      handleCurrentChange (val) {
        this.pageInfo = {
          ...this.pageInfo,
          currentPage: val
        }
        this.fetchList()
      },
      handleAdd () {
        this.boxParams ={ type: 'add',data:{}}
        this.dialogVisible = true
      },
      /**
       * 导出数据
       */
      handleExport () {
        let supplierIds =[]
        this.multipleSelection.forEach(item =>{
          supplierIds.push(item.partnerId)
        })
        util.download('/supplier/export',supplierIds.length ? supplierIds :'','POST')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
