<!--suppress ALL -->
<template>
  <d2-container class="page">
    <div v-if="isShowCustom" class="container">
      <div class="table-container-half wrapper-margin-bottom-15">
        <div class="table-tool">
          <div class="table-tool-title">
            <i class="list-icon"></i>
            <span class="list-title">我的待办</span>
          </div>
          <div class="table-tool-btn">
            <el-radio-group v-model="todoType" size="mini">
              <el-radio-button :label="item.type" v-for="item in todoTypeArray">{{item.name}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="table-wrapper-half">
          <el-table
            :loading="todoLoading"
            border
            size="medium"
            :row-class-name="tableRowClassName"
            :data="busiJbpmFlowDtos"
            @row-click="handleRowClick">
            <el-table-column
              fixed
              label="序号"
              type="index"
              align="center"
              width="50"
              :index="indexMethodTodo">
            </el-table-column>
            <el-table-column
              prop="businessType"
              label="待办类型"
              width="210"
              align="center"
              :formatter="formatterType">
            </el-table-column>
            <el-table-column
              prop="businessSubject"
              label="待办主题"
              width="210"
              align="center">
            </el-table-column>
            <el-table-column
              prop="taskState"
              label="状态"
              :formatter="formatter"
              align="center">
            </el-table-column>
            <el-table-column
              prop="nextActor"
              label="当前处理人"
              width="210"
              align="center">
            </el-table-column>
            <el-table-column
              prop="flowInitorId"
              label="创建人"
              width="150"
              align="center">
            </el-table-column>
            <el-table-column
              prop="flowStartTime"
              label="创建时间"
              width="150"
              align="center"
              :formatter="formatterTime">
            </el-table-column>
          </el-table>
          <div class="table-paging">
            <el-pagination
              background
              @current-change="handleToDoCurrentChange"
              :current-page="todoPageInfo.currentPage"
              :page-size="5"
              layout="total, prev, pager, next, jumper"
              :total="todoPageInfo.total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="table-container-half">
        <div class="table-tool">
          <div class="table-tool-title">
            <i class="list-icon"></i>
            <span class="list-title">我的项目</span>
          </div>
          <div class="table-tool-btn">
            <el-radio-group v-model="projectType" size="mini">
              <el-radio-button :label="item.id" v-for="item in projectTypeArray">{{item.name}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="table-wrapper-half">
          <el-table
            :loading="projectLoading"
            border
            size="medium"
            :row-class-name="tableRowClassName"
            :data="projectInfoDtos"
            @row-click="handleProjectRowClick">
            <el-table-column
              fixed
              label="序号"
              type="index"
              width="50"
              align="center"
              :index="indexMethodProject">
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
              width="280"
              align="center">
            </el-table-column>
            <el-table-column
              prop="projectCode"
              label="项目编号"
              width="280"
              align="center">
            </el-table-column>
            <el-table-column
              prop="cargoName"
              label="货物名称"
              width="280"
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
            <!--<el-table-column-->
              <!--prop="status"-->
              <!--label="状态"-->
              <!--:formatter="formatter"-->
              <!--align="center">-->
            <!--</el-table-column>-->
          </el-table>
          <div class="table-paging">
            <el-pagination
              background
              @current-change="handleProjectsCurrentChange"
              :current-page="projectsPageInfo.currentPage"
              :page-size="5"
              layout="total, prev, pager, next, jumper"
              :total="projectsPageInfo.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <div class="goods-search-container  wrapper-margin-bottom-15">
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
          </ul>
          <div class="search-btn">
            <el-button class="basic-btn"  @click="fetchCargoInfoList">查询</el-button>
            <el-button class="clear-btn"  @click="handleClear">清空</el-button>
          </div>
      </div>
      <div class="table-container">
        <div class="table-tool">
          <div class="table-tool-title">
            <i class="list-icon"></i>
            <span class="list-title">货物信息</span>
          </div>
          <div class="table-tool-btn">
            <!--<el-button size="mini" class="tool-edit-btn" @click="handleEdit">查看</el-button>-->
            <el-button class="tool-download-btn" size="mini" @click="handlePrices">询价</el-button>
            <el-button class="tool-export-btn" size="mini" @click="handleDownload">导出</el-button>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
            :loading="cargoLoading"
            border
            size="medium"
            :row-class-name="tableRowClassName"
            height="90%"
            :data="cargoInfoDtos"
            @selection-change="handleSelectionChange"
            @row-click="handleGoodsRowClick">
            <el-table-column
              fixed
              label="序号"
              type="index"
              align="center"
              width="50"
              :index="indexMethodGoods">
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
              width="280">
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
              width="210">
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
              @size-change="handleCargoSizeChange"
              @current-change="handleCargoCurrentChange"
              :current-page="cargoPageInfo.currentPage"
              :page-sizes="GLOBAL.pageSizes"
              :page-size="cargoPageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="cargoPageInfo.total">
            </el-pagination>
          </div>
        </div>
      </div>

    </div>
  </d2-container>
</template>

<script>
  import {
    FetchBusiJbpmFlow,
    FetchBusiJbpmFlowProject,
    FetchUpdateAlreadyRead
  } from '@/api/sys.audit'
  import {
    FetchCargoInfo
  } from '@/api/sys.goods'
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      filename: __filename,
      todoTypeArray:[
        {
          name:'待办',
          type:0,
        },
        {
          name:'已办',
          type:1,
        },
        {
          name:'待阅',
          type:2,
        },
        {
          name:'已阅',
          type:3,
        }
      ],
      todoType:0,
      isShowCustom: true,
      todoLoading: false,
      busiJbpmFlowDtos:[],
      todoPageInfo: {
        total: 0,
        currentPage: 1,
        pageSize: 5
      },
      projectType: 2,
      projectLoading: false,
      projectTypeArray:[
        {
          name:'审核中',
          id:2,
        },
        {
          name:'已完成',
          id:3,
        },
        {
          name:'已退回',
          id:4,
        }
      ],
      projectInfoDtos:[],
      projectsPageInfo: {
        total: 0,
        currentPage: 1,
        pageSize: 5
      },
      cargoLoading: false,
      searchData:{
        cargoName:''
      },
      multipleSelection:[],
      cargoInfoDtos:[],
      cargoPageInfo: {
        pageSize: this.GLOBAL.pageSize,
        total: 0,
        currentPage: 1
      }
    }
  },
  created () {

  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  watch: {
    info:{
      immediate: true, // 这句重要
      handler (val) {
        if(Object.keys(val).length){
          if(val.roles[0].id === 3){
            this.isShowCustom = false
            this.fetchCargoInfoList()
          }else{
            this.isShowCustom = true
          }
        }
      }
    },
    todoType: {
      immediate: true, // 这句重要
      handler (val) {
        if(this.info.roles[0].id !== 3){
          this.$set(this.todoPageInfo,'currentPage',1)
          this.fetchToDoInfo()
        }
      }
    },
    projectType:{
      immediate: true, // 这句重要
      handler (val) {
        setTimeout(()=>{
          if(this.info.roles[0].id !== 3){
            this.$set(this.projectsPageInfo,'currentPage',1)
            this.fetchProjectsInfoList()
          }
        },300)

      }
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
    formatter (row, column) {
      const statusTxt = ['','草稿','审核中','审核中','退回','完成']
      return statusTxt[Number(row.action)]
    },
    formatterType (row, column){
      let auditType ={
        projectAudit:'项目管理',
        enquiryAudit:'询价管理',
        cargoAudit:'货物管理',
        agentAudit:'代理商管理',
        registerAudit:'注册信息变更'
      }
      return auditType[row.businessType]
    },
    formatterTime (row, column) {
        return row.flowStartTime ? util.formatTime(row.flowStartTime) : ''
    },
    /**
     *待办列表
     * */
    fetchToDoInfo(){
      this.todoLoading = true
      let searchType ={}
      if(this.todoType === 2 || this.todoType === 3){
        searchType.readType = this.todoType === 2 ? 0 :1
        delete searchType.type
      }else if(this.todoType === 0 || this.todoType === 1){
        searchType.type = this.todoType
        delete searchType.readType
      }
      FetchBusiJbpmFlow('get',Object.assign({
        currentPage: this.todoPageInfo.currentPage || 1,
        pageSize: this.todoPageInfo.pageSize,
        nextActor:this.info.username
      }, searchType)).then((res) => {
        let respondData = res.data
        this.busiJbpmFlowDtos = respondData.busiJbpmFlowDtos;
        this.todoPageInfo = {
          ...this.todoPageInfo,
          total: respondData.statistics.totalSize,
          currentPage: respondData.statistics.currentPage
        }
        this.todoLoading = false
      }).catch((err) => {
        this.todoLoading = false
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    indexMethodTodo (index) {
      return index + (this.todoPageInfo.currentPage - 1) * this.todoPageInfo.pageSize + 1
    },
    indexMethodProject (index) {
      return index + (this.projectsPageInfo.currentPage - 1) * this.projectsPageInfo.pageSize + 1
    },
    indexMethodGoods (index) {
      return index + (this.cargoPageInfo.currentPage - 1) * this.cargoPageInfo.pageSize + 1
    },
    /**
     * 待办列表分页查询
     * **/
    handleToDoCurrentChange(val) {
      this.todoPageInfo = {
        ...this.todoPageInfo,
        currentPage: val
      }
      this.fetchToDoInfo()
    },
    /**
     * 点击待办对应的行
     * */
    handleRowClick(row, column, event){
      if(this.todoType === 2){
        let params = {
          id: row.id,
          businessSubject: row.businessSubject
        }
        FetchUpdateAlreadyRead(params).then((res) => {
          this.toDetailPage(row)
        }).catch((err) => {
          this.loading = false
          this.$message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        })
      }else{
        this.toDetailPage(row)
      }
    },
    /**
     * 审核类型跳转到具体的详情页
     * row 当前选中数据
     * */
    toDetailPage(row){
      switch (row.businessType) {
        case 'projectAudit':
          this.$router.push({ name: 'projects-view' , params: { projectId: row.businessId }})
          break
        case 'enquiryAudit':
          this.$router.push({ name: 'prices-edit' , params: { inquiryId: row.businessId  }})
          break
        case 'cargoAudit':
          this.$router.push({ name: 'goods-view' , params: { cargoId: row.businessId  }})
          break
        case 'agentAudit':
          this.$router.push({ name: 'agent-edit' , params: { agentId: row.businessId }})
          break
        case 'registerAudit':
          this.$router.push({ name: 'supplier-view' , params: { partnerId: row.businessId }})
          break
      }
    },
    /**
     * 我的项目列表
     * */
    fetchProjectsInfoList(){
      this.projectLoading = true
      let searchParams ={}
      // if(this.searchData.projectSubject){
      //   searchParams.projectSubject = this.searchData.projectSubject
      // }
      // if(this.searchData.projectCode){
      //   searchParams.projectCode = this.searchData.projectCode
      // }
      searchParams.status = this.projectType
      FetchBusiJbpmFlowProject(Object.assign({
        businessType:'projectAudit',
        parentActor: this.info.username,
        currentPage: this.projectsPageInfo.currentPage || 1,
        pageSize: this.projectsPageInfo.pageSize
      }, searchParams)).then((res) => {
        let respondData = res.data
        this.projectInfoDtos = respondData.projectInfoDtos;
        this.projectsPageInfo = {
          ...this.projectsPageInfo,
          total: respondData.statistics.totalSize,
          currentPage: respondData.statistics.currentPage
        }
        this.projectLoading = false

      }).catch((err) => {
        this.projectLoading = false
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    /**
     * 我的项目分页查询
     * */
    handleProjectsCurrentChange(val) {
      this.projectsPageInfo = {
        ...this.projectsPageInfo,
        currentPage: val
      }
      this.fetchProjectsInfoList()
    },
    /**
     * 点击行对应的项目
     * */
    handleProjectRowClick(row, column, event){
      this.$router.push({ name: 'projects-view' , params: { projectId: row.projectId }})
    },
    /**
     * 货物列表查询清空
     * */
    handleClear () {
      this.searchData ={
        cargoName:''
      }
      this.fetchCargoInfoList()
    },
    indexMethod (index) {
      return index + (this.cargoPageInfo.currentPage - 1) * this.cargoPageInfo.pageSize + 1
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 货物列表
     * */
    fetchCargoInfoList () {
      this.cargoLoading = true
      let searchParams ={}
      if(this.searchData.cargoName){
        searchParams.cargoName = this.searchData.cargoName
      }
      FetchCargoInfo('get',Object.assign({
        currentPage: this.cargoPageInfo.currentPage || 1,
        pageSize: this.cargoPageInfo.pageSize,
        isDelete:2,
        status:5,
      }, searchParams)).then((res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.cargoInfoDtos = respondData.cargoInfoDtos;
          this.cargoPageInfo = {
            ...this.cargoPageInfo,
            total: respondData.statistics.totalSize,
            currentPage: respondData.statistics.currentPage
          }
          this.cargoLoading = false
        }

      }).catch((err) => {
        this.cargoLoading = false
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    /**
     * 改变货物列表分页size
     */
    handleCargoSizeChange (val) {
      this.cargoPageInfo = {
        ...this.cargoPageInfo,
        pageSize: val
      }
      this.fetchCargoInfoList()
    },
    /**
     * 改变公页货物列表当前页
     */
    handleCargoCurrentChange (val) {
      this.cargoPageInfo = {
        ...this.cargoPageInfo,
        currentPage: val
      }
      this.fetchCargoInfoList()
    },
    /**
     * 货物每行点击
     * */
    handleGoodsRowClick(row, column, event){
      this.$router.push({ name: 'goods-view' , params: { cargoId: row.cargoId  }})
    },
    /**
     * 货物-采购人新建询价
     * */
    handlePrices () {
      if(this.multipleSelection.length === 1){
        this.$store.commit('d2admin/global/priceCargoDataSet', this.multipleSelection)
        this.$router.push({ name: 'prices-add' , params: { cargoId:this.multipleSelection[0].cargoId }})
      }else{
        this.$message({
          type: 'info',
          message: '请选择一条需要询价的数据！'
        })
      }
    },
    /**
     * 货物-采购人查看货物信息
     * */
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
    /**
     * 货物-导出列表
     * */
    handleDownload () {
      let cargoIds =[]
      this.multipleSelection.forEach(item =>{
        cargoIds.push(item.cargoId)
      })
      util.download('/cargoInfo/export',cargoIds.length ? cargoIds :'','POST')
    },

  },
}
</script>
<style>

</style>

<style lang="scss" scoped>
.goods-search-container{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 5px 15px;
  .search-input{
    width: 350px;
  }
  .search-btn{
    margin: 15px;
  }
}
</style>
