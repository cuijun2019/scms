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
                        <label>代理商名称:</label>
                        <el-input
                          size="mini"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.agentName"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>状态:</label>
                        <el-select class="search-input" v-model="searchData.status" clearable placeholder="请选择" size="mini">
                          <el-option
                            v-for="item in statusData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </li>
                    </ul>
                    <div class="search-btn">
                      <el-button class="basic-btn" size="mini" @click="fetchList">查询</el-button>
                      <el-button class="clear-btn" size="mini" @click="handleClear">清空</el-button>
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
              <el-button class="tool-basic-btn" size="mini" @click="handleAdd">新建</el-button>
              <el-button size="mini" class="tool-edit-btn" @click="handleEdit">查看/编辑</el-button>
              <!--招标中心角色的人才能审核-->
              <el-button size="mini" class="tool-review-btn" >审核</el-button>
              <el-button size="mini" class="tool-delete-btn" @click="handleDelete">删除</el-button>
              <el-button class="tool-export-btn" size="mini" @click="handleExport">导出</el-button>
            </div>
          </div>
          <div class="table-wrapper">
            <el-table
              :loading="loading"
              border
              size="mini"
              :row-class-name="tableRowClassName"
              height="90%"
              :data="agentInfoDtos"
              @selection-change="handleSelectionChange">
              <el-table-column
                fixed
                type="selection"
                align="center"
                width="55">
              </el-table-column>
              <el-table-column
                fixed
                label="序号"
                type="index"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                prop="agentName"
                label="代理商名称"
                align="center"
                width="210">
              </el-table-column>
              <el-table-column
                prop="agentPoint"
                label="代理费用扣点（百分比）"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                :formatter="formatter">
              </el-table-column>
              <el-table-column
                prop="attachment.attachName"
                label="厂家授权函"
                align="center"
                width="210">
                <template slot-scope="scope">
                  <el-link style="font-size: 12px;" type="primary" @click="handleDownload(scope.row.attachment)">{{scope.row.attachment.attachName}}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="reviewStatus"
                label="审核状态"
                align="center"
                :formatter="formatterReviewStatus">
              </el-table-column>
              <el-table-column
                prop="creator"
                label="创建人"
                align="center"
                width="120">
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="创建时间"
                width="150"
                align="center"
                :formatter="formatterTime">
              </el-table-column>
              <el-table-column label="操作"  width="150" fixed="right" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    class="table-basic-btn"
                    @click="handleEdit(scope.$index, scope.row)">查看代理商信息</el-button>
                  <!--<el-button-->
                    <!--size="mini"-->
                    <!--class="table-basic-btn"-->
                    <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                  <!--<el-button-->
                    <!--size="mini"-->
                    <!--class="table-basic-btn"-->
                    <!--@click="handleEdit(scope.$index, scope.row)">审核</el-button>-->
                  <!--<el-button-->
                    <!--v-if="!scope.row.project_id"-->
                    <!--size="mini"-->
                    <!--type="danger"-->
                    <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <div class="table-paging">
              <el-pagination
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
    <modify-box :dialogVisible="dialogVisible" :boxParams="boxParams" @hideDialog="hideDialog" @fetchList="fetchList"/>
  </d2-container>
</template>

<script>
  import modifyBox from './modify-box'
  import {
    Download
  } from '@/api/sys.global'
  import {
    FetchAgentInfo,
    AgentInfoExport
  } from '@/api/sys.agent'// api
  import util from '@/libs/util'
  export default {
    name: 'agent-list',
    components: {
      modifyBox
    },
    data () {
      return {
        filename: __filename,
        activeNames: ['1'],
        statusData: [
          {
            label: '激活',
            value: 1
          },
          {
            label: '冻结',
            value: 2
          }
        ],
        searchData:{
          agentName:'',
          status:''
        },
        agentInfoDtos: [],
        multipleSelection: [],
        loading: false,
        pageInfo: {
          pageSize: this.GLOBAL.pageSize,
          total: 0,
          currentPage: 1
        },
        boxParams: {},
        dialogVisible: false
      }
    },
    created () {
      this.fetchList()
    },
    methods: {
      handleClear () {
        this.searchData ={
          agentName:'',
          status:''
        }
        this.fetchList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      fetchList () {
        this.loading = true
        let searchParams ={}
        if(this.searchData.agentName){
          searchParams.agentName = this.searchData.agentName
        }
        if(this.searchData.status){
          searchParams.status = this.searchData.status
        }
        FetchAgentInfo('get',Object.assign({
          currentPage: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          isDelete:2
        }, searchParams)).then((res) => {
          this.agentInfoDtos = res.agentInfoDtos;
          this.pageInfo = {
            ...this.pageInfo,
            total: res.statistics.totalSize,
            currentPage: res.currentPage
          }
          this.loading = false

        }).catch((err) => {
          this.loading = false
          // 显示提示
          this.$message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
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
        return  row.status === 1 ? '激活' : '冻结'
      },
      formatterReviewStatus (row, column) {
         let arr = ['','草稿','审批中','审批完成']
        return arr[row.reviewStatus]
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
            this.boxParams ={ type: 'edit',data: this.multipleSelection[0]}
            this.dialogVisible = true
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
            FetchAgentInfo('delete', this.multipleSelection.agentId).then((res) => {
              this.$message({
                message: '删除成功！',
                type: 'success',
                duration: 3 * 1000
              })
              this.fetchList()

            }).catch((err) => {
              this.loading = false
              // 显示提示
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5 * 1000
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
      hideDialog () {
        this.dialogVisible = false
      },
      /**
       * 下载图片
       * */
      handleDownload (fileData) {
        console.log('====',fileData)
        util.download('/download/'+fileData.attachId)
        // Download(fileData.attachId).then((res) => {
        //   console.log('====333',res)
        //   let fileName = res.headers['content-disposition'].match(/filename=(\S*)/)[1];
        //   let blob = new Blob([res.data], {type: res.headers['content-type']})
        //   let downloadElement = document.createElement('a')
        //   let href = window.URL.createObjectURL(blob)
        //   downloadElement.href = href
        //   downloadElement.download = fileName //下载后文件名
        //   document.body.appendChild(downloadElement)
        //   downloadElement.click() //点击下载
        //   document.body.removeChild(downloadElement)
        //   window.URL.revokeObjectURL(href) //释放blob对象
        //
        // }).catch((err) => {
        //   // 显示提示
        //   this.$message({
        //     message: err.message,
        //     type: 'error',
        //     duration: 5 * 1000
        //   })
        // })
      },
      /**
       * 导出数据
       */
      handleExport () {
       util.download('/agentInfo/export')
       //  AgentInfoExport('get').then((res) => {
       //    console.log(9999, res)
       //    console.log('====================', res.headers['content-type'])
       //    let fileName = res.headers['content-disposition'].match(/filename=(\S*)/)[1];
       //    let blob = new Blob([res.data], {type: res.headers['content-type']})
       //    let downloadElement = document.createElement('a')
       //    let href = window.URL.createObjectURL(blob)
       //    downloadElement.href = href
       //    downloadElement.download = fileName //下载后文件名
       //    document.body.appendChild(downloadElement)
       //    downloadElement.click() //点击下载
       //    document.body.removeChild(downloadElement)
       //    window.URL.revokeObjectURL(href) //释放blob对象
       //  }).catch((err) => {
       //    console.log('=========', err)
       //    // 显示提示
       //    this.$message({
       //      message: err.message,
       //      type: 'error',
       //      duration: 3 * 1000
       //    })
       //  })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
