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
                  <!--<p class="search-title">列表检索条件</p>-->
                  <div class="search-content">
                    <ul class="search-con">
                      <li class="search-item">
                        <label>货物名称:</label>
                        <el-input
                          size="mini"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.cargoName"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>配件名称:</label>
                        <el-input
                          size="mini"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.subject"
                          clearable>
                        </el-input>
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
              <el-button size="mini" class="tool-delete-btn" @click="handleDelete">删除</el-button>
              <el-button class="tool-download-btn" size="mini" @click="handleDownloadTemplate">下载导入模板</el-button>
              <el-button class="tool-import-btn" size="mini" >导入</el-button>
              <el-button class="tool-export-btn" size="mini" @click="handleDownload">导出</el-button>
            </div>
          </div>
          <div class="table-wrapper">
            <el-table
              :loading="loading"
              border
              size="mini"
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
                width="210">
              </el-table-column>
              <el-table-column
                prop="itemName"
                align="center"
                label="货物品目"
                width="210">
              </el-table-column>
              <el-table-column
                prop="cargoName"
                align="center"
                width="210"
                label="货物名称">
              </el-table-column>
              <el-table-column
                prop="cargoCode"
                align="center"
                label="货物编号"
                width="210">
              </el-table-column>
              <el-table-column
                prop="brand"
                align="center"
                label="品牌"
                width="120">
              </el-table-column>
              <el-table-column
                prop="model"
                align="center"
                label="型号"
                width="150">
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
                width="120">
              </el-table-column>
              <el-table-column
                prop="type"
                align="center"
                label="进口/国产类别"
                width="120">
              </el-table-column>
              <el-table-column
                prop="currency"
                align="center"
                label="币种"
                width="210">
              </el-table-column>
              <el-table-column
                prop="guaranteeRate"
                align="center"
                label="维保率/月"
                width="120">
              </el-table-column>
              <el-table-column
                prop="attachment.attachName"
                label="证明文件"
                align="center"
                width="210">
                <template slot-scope="scope">
                  <el-link v-if="scope.row.attachment" style="font-size: 12px;" type="primary" @click="handleDownloadPhoto(scope.row.attachment)">{{scope.row.attachment.attachName }}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                align="center"
                label="型号"
                width="150">
              </el-table-column>
              <!--<el-table-column label="操作"  width="150" fixed="right">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button-->
                    <!--size="mini"-->
                    <!--class="table-basic-btn"-->
                    <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                  <!--<el-button-->
                    <!--size="mini"-->
                    <!--type="danger"-->
                    <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
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
  import modifyBox from './main-modify-box'
  import {
    Download
  } from '@/api/sys.global'
  import {
    FetchCargoInfo,
    FetchDownloadTemplate
  } from '@/api/sys.goods'
  import util from '@/libs/util'
  import { mapActions } from 'vuex'
  export default {
    name: 'goods-list',
    components: {
      modifyBox
    },
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
      this.fetchList()
    },
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/goods/list'})
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
          isDelete:2
        }, searchParams)).then((res) => {

          this.cargoInfoDtos = res.cargoInfoDtos;
          this.pageInfo = {
            ...this.pageInfo,
            total: res.statistics.totalSize,
            currentPage: res.statistics.currentPage
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
        console.log('==========3333',this.multipleSelection[0])
        if(this.multipleSelection.length === 1){
          // this.boxParams ={ type: 'edit',data: this.multipleSelection[0]}
          // this.dialogVisible = true
          if(this.multipleSelection[0].status === 1 || this.multipleSelection[0].status === 3){
            this.$router.push({ name: 'goods-edit' , params: { cargoId: this.multipleSelection[0].cargoId }})
          }
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
            FetchCargoInfo('delete', this.multipleSelection[0].cargoId).then((res) => {
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
       * 下载图片
       * */
      handleDownloadPhoto (fileData) {
        util.download('/download/' + fileData.attachId)
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
        // this.boxParams ={ type: 'add',data:{}}
        // this.dialogVisible = true
        this.$router.push({ path: '/goods/add' })
      },
      /**
       * 下载导入模板
       */
      handleDownloadTemplate () {
        util.download('/cargoInfo/downloadTemplate')
      },
      handleDownload () {
        util.download('/cargoInfo/export')
      },
      hideDialog () {
        this.dialogVisible = false
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
