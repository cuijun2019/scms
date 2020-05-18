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
                        <label>项目主题:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.projectSubject"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>项目编号:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.projectCode"
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
            <div class="table-tool-btn">
              <el-button size="mini" class="tool-edit-btn" @click="handleView">查看</el-button>
              <el-button class="tool-export-btn" size="mini" @click="handleExport">导出</el-button>
            </div>
          </div>
          <div class="table-wrapper">
            <el-table
              :loading="loading"
              border
              size="medium"
              :row-class-name="tableRowClassName"
              height="90%"
              :data="bidNoticeDtos"
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
                prop="projectSubject"
                label="项目主题"
                align="center"
                width="280">
              </el-table-column>
              <el-table-column
                prop="projectCode"
                label="项目编号"
                align="center"
                width="280">
              </el-table-column>
              <el-table-column
                prop="attachment.attachName"
                label="成交通知书"
                align="center"
                width="320">
                <template slot-scope="scope">
                  <el-link style="font-size: 12px;" :underline="false" type="primary" @click="handleDownloadPhoto(scope.row.attachment)">{{scope.row.attachment ? scope.row.attachment.attachName :''}}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="supplier"
                label="成交代理商"
                align="center"
                width="210">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="成交金额"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="signDate"
                label="签收时间"
                width="180"
                align="center"
                :formatter="formatterTime">
              </el-table-column>
              <el-table-column
                prop="creator"
                label="创建人"
                align="center">
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="创建时间"
                align="center"
                width="250"
                :formatter="formatterTime">
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
  import {
    FetchBidsNotice
  } from '@/api/sys.bids'
  import util from '@/libs/util'
  import { mapActions } from 'vuex'
  export default {
    name: 'bids-list',
    data () {
      return {
        filename: __filename,
        activeNames: ['1'],
        options: [
          {
            value: 1,
            label: '激活'
          }, {
            value: 2,
            label: '冻结'
          }],
        searchData:{
          projectSubject:'',
          projectCode:''
        },
        bidNoticeDtos: [],
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
        this.closeRight({pageSelect: '/bids/list'})
      })
    },
    methods: {
      ...mapActions('d2admin/page', [
        'closeRight'
      ]),
      indexMethod (index) {
        return index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      },
      handleClear () {
        this.searchData ={
          projectSubject:'',
          projectCode:''
        }
        this.fetchList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      fetchList () {
        this.loading = true
        let searchParams ={}
        if(this.searchData.projectSubject){
          searchParams.projectSubject = this.searchData.projectSubject
        }
        if(this.searchData.projectCode){
          searchParams.projectCode = this.searchData.projectCode
        }
        FetchBidsNotice('get',Object.assign({
          currentPage: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          isDelete:2
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.bidNoticeDtos = respondData.bidNoticeDtos;
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
        if(column.property === 'signDate'){
          return  row.signDate ? util.formatTime(row.signDate) :''
        }else if(column.property === 'createDate'){
          return  row.createDate ? util.formatTime(row.createDate) :''
        }
      },
      handleView (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'bids-view' , params: { bidId: this.multipleSelection[0].bidId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看的数据！'
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
            FetchUser('delete', this.multipleSelection[0].bidId).then((res) => {
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
            })
          })
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
        let bidNoticeIds =[]
        this.multipleSelection.forEach(item =>{
          bidNoticeIds.push(item.bidId)
        })
        util.download('/bidNotice/export',bidNoticeIds.length ? bidNoticeIds :'','POST')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
