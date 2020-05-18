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
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.agentName"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>状态:</label>
                        <el-select class="search-input" v-model="searchData.status" clearable placeholder="请选择" size="medium">
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
                 <el-button v-if="item.menuCode =='agentCreate' " class="tool-basic-btn" size="mini" @click="handleAdd">{{item.menuName}}</el-button>
                 <el-button v-else-if="item.menuCode =='agentCheckOrEdit'" size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                 <!--招标中心角色的人才能审核-->
                 <el-button v-else-if="item.menuCode =='agentCheck'" size="mini" class="tool-review-btn" >{{item.menuName}}</el-button>
                 <el-button v-else-if="item.menuCode =='agentDelete'" size="mini" class="tool-delete-btn" @click="handleDelete">{{item.menuName}}</el-button>
                 <el-button v-else-if="item.menuCode =='agentExport'" class="tool-export-btn" size="mini" @click="handleExport">{{item.menuName}}</el-button>
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
              :data="agentInfoDtos"
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
                prop="agentName"
                label="代理商名称"
                align="center"
                width="280">
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
                width="320">
                <template slot-scope="scope">
                  <el-link style="font-size: 12px;" type="primary" @click="handleDownloadPhoto(scope.row.attachment)">{{scope.row.attachment.attachName}}</el-link>
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
                align="center">
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="创建时间"
                width="180"
                align="center"
                :formatter="formatterTime">
              </el-table-column>
              <el-table-column label="操作"  width="150" fixed="right" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    class="table-basic-btn"
                    :disabled='scope.row.reviewStatus !== 5'
                    @click="handleAgentView(scope.$index, scope.row)">查看代理商信息</el-button>
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
  import {Download} from '@/api/sys.global'
  import {FetchAgentInfo,FetchDeleteAgents} from '@/api/sys.agent'// api
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'agent-list',
    components: {
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
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/agent/list'})
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
          status:1,
          isDelete:2,
          reviewStatus:5,
          actor:this.info.username
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.agentInfoDtos = respondData.agentInfoDtos;
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
        return  row.status === 1 ? '激活' : '冻结'
      },
      formatterReviewStatus (row, column) {
         let arr = ['','草稿','审批中','同意','退回','审批完成']
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
            this.$router.push({ name: 'agent-edit' , params: { agentId: this.multipleSelection[0].agentId }})
          }else{
            this.$message({
              type: 'info',
              message: '请选择一条需要查看/编辑的数据！'
            })
          }
      },
      handleDelete (index, row) {
        let agentIds =[]
        this.multipleSelection.forEach(item =>{
          if(item.reviewStatus === 1){
            agentIds.push(item.agentId)
          }
        })
        if(agentIds.length){
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            FetchDeleteAgents(agentIds).then((res) => {
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
      handleAgentView (index, row) {
        this.$router.push({ name: 'supplier-agent-view' , params: { partnerId: row.partnerId }})
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
        this.$router.push({ path: '/agent/add' })
      },
      hideDialog () {
        this.dialogVisible = false
      },
      /**
       * 下载图片
       * */
      handleDownloadPhoto (fileData) {
        util.download('/download/' + fileData.attachId)
      },
      /**
       * 导出数据
       */
      handleExport () {
        let agentIds =[]
        this.multipleSelection.forEach(item =>{
          agentIds.push(item.agentId)
        })
        util.download('/agentInfo/export',agentIds.length ? agentIds :'','POST')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
