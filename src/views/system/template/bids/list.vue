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
                          v-model="searchData.subject"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>项目编号:</label>
                        <el-select class="search-input" v-model="searchData.status" clearable placeholder="请选择" size="medium">
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
                <el-button v-if="item.menuCode =='templateBidsCreate' " class="tool-basic-btn" size="mini" @click="handleAdd">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='templateBidsCheckOrEdit'"  size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='templateBidsDelete'" size="mini" class="tool-delete-btn" @click="handleDelete">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='templateBidsExport'" class="tool-export-btn" size="mini" @click="handleDownload">{{item.menuName}}</el-button>
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
              :data="resultTemplateDtos"
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
                prop="bidTemplateSubject"
                label="项目主题"
                width="280"
                align="center">
              </el-table-column>
              <el-table-column
                prop="status"
                label="项目编号"
                width="280"
                align="center">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                :formatter="formatter">
              </el-table-column>
              <el-table-column
                prop="attachment.attachName"
                label="模板文件"
                width="320"
                align="center">
                <template slot-scope="scope">
                  <el-link style="font-size: 12px;" :underline="false" type="primary" @click="handleDownloadPhoto(scope.row.attachment)">{{scope.row.attachment.attachName}}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="creator"
                label="创建人"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="创建时间"
                width="180"
                align="center"
                :formatter="formatterTime">
              </el-table-column>
              <el-table-column
                prop="maintenanceMan"
                label="最后维护人"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="maintenanceDate"
                label="最后维护时间"
                width="180"
                align="center"
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
  import {FetchBidsTemplate} from '@/api/sys.template.bids'//api
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'template-bids',
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
          subject:'',
          status:''
        },
        resultTemplateDtos: [],
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
        this.closeRight({pageSelect: '/template/bids'})
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
          subject:'',
          status:''
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
        if(this.searchData.subject){
          searchParams.subject = this.searchData.subject
        }
        if(this.searchData.status){
          searchParams.status = this.searchData.status
        }
        FetchBidsTemplate('get',Object.assign({
          Page: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          isDelete:2
        }, searchParams)).then((res) => {
          let respondData = res.data
          this.resultTemplateDtos = respondData.bidTemplateDtos;
          this.pageInfo = {
            ...this.pageInfo,
            total: respondData.statistics.totalSize,
            currentPage: respondData.statistics.currentPage
          }
          this.loading = false

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
        if(column.property === 'maintenanceDate'){
          return  util.formatTime(row.maintenanceDate)
        }else if(column.property === 'createDate'){
          return  util.formatTime(row.createDate)
        }
      },
      handleEdit (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'template-bids-edit' , params: { bidTemplateId: this.multipleSelection[0].bidTemplateId }})
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
          FetchBidsTemplate('delete', this.multipleSelection[0].bidTemplateId).then((res) => {
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
            message: '请选择一条需要删除的数据！'
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
        this.$router.push({ path: '/template/bids-add' })
      },
      /**
       * 下载图片
       * */
      handleDownloadPhoto (fileData) {
        util.download('/download/' + fileData.attachId)
      },
      /**
       * 导出
       */
      handleDownload () {
        util.download('/cargoInfo/export')
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
