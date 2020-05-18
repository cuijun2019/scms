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
            <div class="table-tool-btn" v-if="currentRouterData">
              <div class="btn-con" v-for="(item, index) in currentRouterData.menuBtn" >
                <el-button v-if="item.menuCode =='projectCreate' " class="tool-basic-btn" size="mini" @click="handleAdd">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='projectCheck'" size="mini" class="tool-edit-btn" @click="handleView">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='projectCheckOrEdit'" size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='projectDelete'" size="mini" class="tool-delete-btn" @click="handleDelete">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='projectCheckRecords'"  class="tool-download-btn" size="mini" @click="handlePrices">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='projectExport'"  class="tool-export-btn" size="mini" @click="handleExport">{{item.menuName}}</el-button>
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
              :data="projectInfoDtos"
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
                prop="projectSubject"
                label="项目主题"
                width="250"
                align="center">
              </el-table-column>
              <el-table-column
                prop="projectCode"
                label="项目编号"
                width="250"
                align="center">
              </el-table-column>
              <el-table-column
                prop="cargoName"
                label="货物名称"
                width="250"
                align="center">
              </el-table-column>
              <el-table-column
                prop="cargoTotal"
                label="货物金额"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="项目金额"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="currency"
                label="币种"
                align="center">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                width="180"
                :formatter="formatter"
                align="center">
              </el-table-column>
              <el-table-column
                prop="attachment.attachment_c"
                label="合同"
                width="350"
                align="center">
                <template slot-scope="scope">
                  <el-link style="font-size: 12px;" :underline="false" type="primary" @click="handleDownloadPhoto(scope.row.attachment_c)">{{scope.row.attachment_c ? scope.row.attachment_c.attachName :''}}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="attachment_n.attachName"
                label="成交通知书"
                width="350"
                align="center">
                <template slot-scope="scope">
                  <el-link style="font-size: 12px;" :underline="false" type="primary" @click="handleDownloadPhoto(scope.row.attachment_n)">{{scope.row.attachment_n ? scope.row.attachment_n.attachName :''}}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="attachment_p.attachName"
                label="采购结果通知书"
                width="350"
                align="center">
                <template slot-scope="scope">
                  <el-link style="font-size: 12px;" :underline="false" type="primary" @click="handleDownloadPhoto(scope.row.attachment_p)">{{scope.row.attachment_p ? scope.row.attachment_p.attachName :''}}</el-link>
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
  import {FetchProjectInfo} from '@/api/sys.projects'
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'projects-list',
    components: {},
    data () {
      return {
        filename: __filename,
        activeNames: ['1'],
        options: [
          {
            value: 1,
            label: '草稿'
          }, {
            value: 2,
            label: '审核中'
          },{
            value:3,
            label:'退回'
          }],
        searchData:{
          projectSubject:'',
          projectCode:''
        },
        projectInfoDtos: [],
        loading: false,
        pageInfo: {
          pageSize: this.GLOBAL.pageSize,
          total: 0,
          currentPage: 1
        },
        boxParams: {},
        dialogVisible: false,
        multipleSelection:[]
      }
    },
    created () {
      this.fetchList()
    },
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/projects/list'})
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
        if(this.$route.params.inquiryId){
          searchParams.inquiryId = this.$route.params.inquiryId
        }
        FetchProjectInfo('get',Object.assign({
          currentPage: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          isDelete:2,
          actor:this.info.username
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.projectInfoDtos = respondData.projectInfoDtos;
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
        return  this.GLOBAL.statusTxt[row.status]
      },
      formatterTime (row, column) {
        if(column.property === 'maintenanceDate'){
          return  util.formatTime(row.maintenanceDate)
        }else if(column.property === 'createDate'){
          return  util.formatTime(row.createDate)
        }
      },
      handleView(){
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'projects-view' , params: { projectId: this.multipleSelection[0].projectId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看的数据！'
          })
        }
      },
      handleEdit (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'projects-edit' , params: { projectId: this.multipleSelection[0].projectId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看/编辑的数据！'
          })
        }
      },
      /**
       * 删除草稿
       * */
      handleDelete (index, row) {
        // if(this.multipleSelection.length === 1){
          let projectIds =[]
          this.multipleSelection.forEach(item =>{
            if(item.status === 1){
              projectIds.push(item.projectId)
            }
          })
        if(projectIds.length){
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            FetchProjectInfo('delete', projectIds).then((res) => {
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
              message: '请选择一条需要删除的草稿数据！'
            })
        }

        // }else{
        //   this.$message({
        //     type: 'info',
        //     message: '请选择一条需要删除的数据！'
        //   });
        // }

      },
      handlePrices(){
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'prices-edit' , params: { inquiryId: this.multipleSelection[0].inquiryInfo.inquiryId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看关联询价记录的数据！'
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
        this.$router.push({ path: '/projects/add' })
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
        let projectIds =[]
        this.multipleSelection.forEach(item =>{
          projectIds.push(item.projectId)
        })
        util.download('/projectInfo/export',projectIds.length ? projectIds :'','POST')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
