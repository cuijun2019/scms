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
                        <label>询价单号:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.inquiryCode"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>货物名称:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.cargoName"
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
                <!--<el-button v-if="item.menuCode =='pricesAsk' " size="mini" class="tool-edit-btn" @click="handleAdd">{{item.menuName}}</el-button>-->
                <el-button v-if="item.menuCode =='pricesCheck'" size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='pricesProject'" size="mini" class="tool-download-btn" @click="handleProject">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='pricesExport'" class="tool-export-btn" size="mini" @click="handleExport">{{item.menuName}}</el-button>
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
              :data="inquiryInfoDtos"
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
                width="55"
                align="center">
              </el-table-column>
              <el-table-column
                prop="inquiryCode"
                label="询价单号"
                width="280"
                align="center">
              </el-table-column>
              <el-table-column
                prop="purchaser"
                label="采购人"
                width="250"
                align="center">
              </el-table-column>
              <el-table-column
                prop="cargoInfo.cargoName"
                label="货物名称"
                width="280"
                align="center">
              </el-table-column>
              <el-table-column
                prop="unit"
                label="采购单位"
                width="320"
                align="center">
              </el-table-column>
              <el-table-column
                prop="partnerInfo.companyNo"
                label="供应商名称"
                width="280"
                align="center">
              </el-table-column>
              <el-table-column
                prop="cargoBaseInfo"
                label="货物基本参数"
                width="320"
                align="center">
              </el-table-column>
              <el-table-column
                prop="rePrice"
                label="参考价格"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="inquiryDate"
                label="询价时间"
                width="180"
                align="center"
                :formatter="formatterTime">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
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
  import {FetchInquiryInfo} from '@/api/sys.prices'//api
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'prices-list',
    data () {
      return {
        filename: __filename,
        activeNames: ['1'],
        searchData:{
          inquiryCode:'',
          cargoName:''
        },
        inquiryInfoDtos: [],
        loading: false,
        pageInfo: {
          pageSize: this.GLOBAL.pageSize,
          total: 0,
          currentPage: 1
        },
        boxParams: {},
        dialogVisible: false,
        multipleSelection: [],
      }
    },
    created () {

    },
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/prices/list'})
      })
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ]),
      ...mapState('d2admin/menu', [
        'currentRouterData'
      ])
    },
    watch: {
      info: {
        immediate: true, // 这句重要
        handler (val) {
          if (Object.keys(val).length) {
            this.fetchList()
          }
        }
      }

    },
    methods: {
      ...mapActions('d2admin/page', [
        'closeRight'
      ]),
      handleClear () {
        this.searchData ={
            subject:'',
          cargoName:''
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
        if(this.searchData.inquiryCode){
          searchParams.inquiryCode = this.searchData.inquiryCode
        }
        if(this.searchData.cargoName){
          searchParams.cargoName = this.searchData.cargoName
        }
        FetchInquiryInfo('get',Object.assign({
          currentPage: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          isDelete:2,
          actor: this.info.username
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.inquiryInfoDtos = respondData.inquiryInfoDtos;
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
            message: err.message,
            type: 'error'
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
        return row.inquiryDate ? util.formatTime(row.inquiryDate) :''
      },
      handleEdit (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'prices-edit' , params: { inquiryId: this.multipleSelection[0].inquiryId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看/编辑的数据！'
          })
        }
      },
      handleProject(){
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'projects-list' , params: { inquiryId: this.multipleSelection[0].inquiryId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看关联项目的数据！'
          })
        }
      },
      handleDelete (index, row) {
        let inquiryIds =[]
        this.multipleSelection.forEach(item =>{
          if(item.status === 1){
            inquiryIds.push(item.inquiryId)
          }
        })
        if(inquiryIds.length){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          FetchInquiryInfo('delete', inquiryIds).then((res) => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.fetchList()

          }).catch((err) => {
            this.loading = false
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要删除的草稿数据！'
          })
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
        this.$router.push({ path: '/prices/add' })
      },
      /**
       * 下载图片
       * */
      handleDownloadPhoto (fileData) {
        util.download('/download/' + fileData.attachId)
      },
      /**
       * 导出列表
       * 不传默认导出所有数据
       * 导出数据
       */
      handleExport (){
        let inquiryIds =[]
        this.multipleSelection.forEach(item =>{
          inquiryIds.push(item.inquiryId)
        })
        util.download('/inquiryInfo/export',inquiryIds.length ? inquiryIds :'','POST')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
