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
                        <label>货物名称:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.cargoName"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>配件名称:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.subject"
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
                <el-button v-else-if="item.menuCode =='supplierExport'"  size="mini" class="tool-export-btn" >{{item.menuName}}</el-button>

                <el-button v-if="item.menuCode =='goodsCreate' " class="tool-basic-btn" size="mini" @click="handleAdd">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='goodsCheck'" size="mini" class="tool-edit-btn" @click="handleView">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='goodsCheckOrEdit'" size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='goodsDelete'" size="mini" class="tool-delete-btn" @click="handleDelete">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='goodsDownload'" class="tool-download-btn" size="mini" @click="handleDownloadTemplate">{{item.menuName}}</el-button>
                <div class="upload-div" v-else-if="item.menuCode =='goodsImport'">
                  <input type="file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="upload-input"  ref="importFile" @change="handleUpload">
                  <el-button class="tool-import-btn upload-btn" size="mini">{{item.menuName}}</el-button>
                </div>
                <el-button v-else-if="item.menuCode =='goodsExport'" class="tool-export-btn" size="mini" @click="handleDownload">{{item.menuName}}</el-button>

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
              :data="cargoInfoDtos"
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
                prop="cargoSerial"
                align="center"
                label="货物序号"
                width="250">
              </el-table-column>
              <el-table-column
                prop="itemName"
                align="center"
                label="货物品目"
                width="280">
              </el-table-column>
              <el-table-column
                prop="cargoName"
                align="center"
                width="280"
                label="货物名称">
              </el-table-column>
              <el-table-column
                prop="cargoCode"
                align="center"
                label="货物编号"
                width="250">
              </el-table-column>
              <el-table-column
                prop="brand"
                align="center"
                label="品牌"
                width="180">
              </el-table-column>
              <el-table-column
                prop="model"
                align="center"
                label="型号"
                width="180">
              </el-table-column>
              <el-table-column
                label="主要参数"
                width="180"
                align="center">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p> {{ scope.row.mainParams }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">查看详情</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="manufactor"
                align="center"
                label="产地"
                width="180">
              </el-table-column>
              <el-table-column
                prop="type"
                align="center"
                label="进口/国产类别"
                width="180">
              </el-table-column>
              <el-table-column
                prop="currency"
                align="center"
                label="币种"
                width="250">
              </el-table-column>
              <el-table-column
                prop="guaranteeRate"
                align="center"
                label="维保率/月"
                width="180">
              </el-table-column>
              <el-table-column
                prop="attachment.attachName"
                label="证明文件"
                align="center"
                width="320">
                <template slot-scope="scope">
                  <el-link v-if="scope.row.attachment" style="font-size: 12px;" type="primary" @click="handleDownloadPhoto(scope.row.attachment)">{{scope.row.attachment.attachName }}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                align="center"
                label="备注">
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
  import {FetchCargoInfo, FetchDownloadTemplate, FetchUpLoadCargoInfo} from '@/api/sys.goods'
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'goods-list',
    components: {},
    data () {
      return {
        filename: __filename,
        activeNames: ['1'],
        searchData:{
          cargoName:'',
          subject:'',
          status:''
        },
        cargoInfoDtos: [],
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
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/goods/list'})
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
      indexMethod (index) {
        return index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      },
      handleClear () {
        this.searchData ={
          subject:'',
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
        if(this.searchData.cargoName){
          searchParams.cargoName = this.searchData.cargoName
        }
        if(this.searchData.subject){
          searchParams.subject = this.searchData.subject
        }
        if(this.searchData.status){
          searchParams.status = this.searchData.status
        }
        FetchCargoInfo('get',Object.assign({
          currentPage: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          isDelete:2,
          actor: this.info.username
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.cargoInfoDtos = respondData.cargoInfoDtos;
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
        if(column.property === 'maintenanceDate'){
          return  util.formatTime(row.maintenanceDate)
        }else if(column.property === 'createDate'){
          return  util.formatTime(row.createDate)
        }
      },
      handleView (){
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'goods-view' , params: { cargoId: this.multipleSelection[0].cargoId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看的数据！'
          })
        }
      },
      handleEdit (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'goods-edit' , params: { cargoId: this.multipleSelection[0].cargoId }})
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要查看/编辑的数据！'
          })
        }
      },
      handleDelete (index, row) {
        let cargoIds =[]
        this.multipleSelection.forEach(item =>{
          if(item.status === 1){
            cargoIds.push(item.cargoId)
          }
        })
        if(cargoIds.length){
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            FetchCargoInfo('delete', cargoIds).then((res) => {
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
        this.$router.push({ path: '/goods/add' })
      },
      /**
       * 下载导入模板
       */
      handleDownloadTemplate () {
        util.download('/cargoInfo/downloadTemplate')
      },
      /**
       * 导出列表
       * */
      handleDownload () {
        let cargoIds =[]
        this.multipleSelection.forEach(item =>{
          cargoIds.push(item.cargoId)
        })
        util.download('/cargoInfo/export',cargoIds.length ? cargoIds :'','POST')
      },
      /**
       * 下载图片
       * */
      handleDownloadPhoto (fileData) {
        util.download('/download/' + fileData.attachId)
      },
      /**
       * 导入配件数据
       */
      handleUpload (file) {
        this.partLoading = true
        this.partFile = this.$refs.importFile.files[0]
          let formData = new FormData()
          formData.append('file', this.partFile)
          FetchUpLoadCargoInfo(formData).then((res) => {
            this.pageInfo.currentPage = 1
            this.fetchList()
          }).catch((err) => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
