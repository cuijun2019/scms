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
                        <label>用户名:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.username"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>状态:</label>
                        <el-select class="search-input" v-model="searchData.enabled" clearable placeholder="请选择" size="medium">
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
                      <el-button class="basic-btn" @click="fetchList">查询</el-button>
                      <el-button class="clear-btn" @click="handleClear">清空</el-button>
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
                <el-button v-if="item.menuCode =='systemUserCreate' " class="tool-basic-btn" size="mini" @click="handleAdd">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='systemUserCheckOrEdit'"  size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='systemUserDelete'" size="mini" class="tool-delete-btn" @click="handleDelete">{{item.menuName}}</el-button>
                <el-popover
                  placement="left"
                  width="180"
                  trigger="manual"
                  v-model="visible"
                  v-else-if="item.menuCode =='systemUserRoles'"
                >
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  <el-checkbox v-model="invertSelect" @change="handleInvertSelect">反选</el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group class="role-con" v-model="checkedRoles" @change="handleCheckedRolesChange">
                    <el-checkbox v-for="item in roleType" :label="item.id" :key="item.value">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                  <div class="role-btn">
                    <el-button size="mini" class="save-btn" @click="handleChangeUserRole">保存</el-button>
                    <el-button size="mini" class="close-btn" @click="handleCloseUserRole">关闭</el-button>
                  </div>
                  <el-button size="mini" class="tool-roles-btn" slot="reference"  @click="handleEditRoles">{{item.menuName}}</el-button>
                </el-popover>
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
              :data="userDtos"
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
                prop="username"
                label="用户名"
                align="center"
                width="280">
              </el-table-column>
              <el-table-column
                prop="fullname"
                label="用户姓名"
                align="center"
                width="250">
              </el-table-column>
              <el-table-column
                prop="sex"
                label="性别"
                align="center">
              </el-table-column>
              <el-table-column
                prop="company"
                label="所在公司"
                align="center"
                width="280">
              </el-table-column>
              <el-table-column
                prop="telephone"
                label="联系电话"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="email"
                label="邮箱"
                align="center"
                width="250">
              </el-table-column>
              <el-table-column
                prop="enabled"
                label="状态"
                align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.enabled ? '激活' : '冻结'}}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="roles"
                label="拥有角色"
                width="120"
                align="center">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="left">
                    <div class="role-wrapper">
                      <span class="role-span" v-for="role in scope.row.roles">{{role.description}}</span>
                    </div>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">查看详情</el-tag>
                    </div>
                  </el-popover>
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
  import {FetchUser, FetchChangeUserRole, FetchGetAllRoles} from '@/api/sys.system'
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'system-user',
    components: {},
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
          username:'',
          enabled:''
        },
        userDtos: [],
        loading: false,
        pageInfo: {
          pageSize: this.GLOBAL.pageSize,
          total: 0,
          currentPage: 1
        },
        roleType:[],
        boxParams: {},
        dialogVisible: false,
        multipleSelection: [],
        visible:false,
        checkAll: false,
        invertSelect:false,
        checkedRoles: [],
        isIndeterminate: true,
        currentData:{}
      }
    },
    created () {
      this.fetchList()
      this.fetchGetAllRoles()
    },
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/system/user'})
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
      indexMethod (index) {
        return index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      },
      handleClear () {
        this.searchData ={
          username:'',
          enabled:''
        }
        this.fetchList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      fetchList () {
        this.loading = true
        let searchParams ={}
        if(this.searchData.username){
          searchParams.username = this.searchData.username
        }
        if(this.searchData.enabled ){
          searchParams.enabled = this.searchData.enabled == 1 ? true : false
        }
        FetchUser('get',Object.assign({
          currentPage: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          isDelete:2
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.userDtos = respondData.userDtos;
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
      fetchGetAllRoles(){
        FetchGetAllRoles().then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.roleType = respondData
          }
        }).catch((err) => {
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
      formatterTime (row, column) {
        if(column.property === 'maintenanceDate'){
          return  util.formatTime(row.maintenanceDate)
        }else if(column.property === 'createDate'){
          return  util.formatTime(row.createDate)
        }
      },
      handleEdit (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'system-user-edit' , params: { id: this.multipleSelection[0].id }})
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
            FetchUser('delete', this.multipleSelection[0].id).then((res) => {
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
          });
        }

      },
      /**
       * 角色配置
       * */
      handleCheckAllChange(val) {
        this.checkedRoles = val ?  this.roleType.map(c => c.id) : [];
        this.invertSelect = false;
        this.isIndeterminate = false;
      },
      handleCheckedRolesChange(value) {
        this.invertSelect = false;
        this.checkAll = this.checkedRoles.length === this.roleType.length
        this.isIndeterminate = 0 < this.checkedRoles.length && this.checkedRoles.length < this.roleType.length

      },
      handleInvertSelect(val) {
        this.checkedRoles = this.roleType
          .filter(item => !this.checkedRoles.includes(item.id))
          .map(c => c.id);
      },
      handleEditRoles(){
        if(this.multipleSelection.length === 1){
          this.currentData = this.multipleSelection[0]
          let roles = this.multipleSelection[0].roles
          let roleData = []
          roles.forEach(item =>{
            roleData.push(item.id)
          })
          this.checkedRoles = roleData
          this.visible = !this.visible
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要配置角色的数据！'
          })
        }

      },
      handleChangeUserRole(){
        let roleStr =  this.checkedRoles.join(',');
        this.checkedRoles.length === 0 ? roleStr = 0 :''
        FetchChangeUserRole(this.currentData.id,roleStr).then((res) => {
          if (res.message === 'success') {
            this.$message({
              message: '修改用户角色成功！',
              type: 'success'
            })
            this.visible = false
            this.currentData = {}
            this.checkedRoles = []
            this.fetchList()
          }
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      },
      handleCloseUserRole(){
        this.currentData = {}
        this.checkedRoles = []
        this.visible = false
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
        this.$router.push({ path: '/system/user-add' })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .el-checkbox{
    color: #333333;
    font-weight:normal;
  }
  .role-con{
    display: flex;
    justify-content: flex-start;
    flex-flow: column;
    .el-checkbox__label{
      color: #333333;
      font-weight:normal;
    }
  }
  .role-btn{
    margin-top: 15px;
    text-align: center;
  }
  .role-wrapper{
    display: flex;
    justify-content: flex-start;
    /*align-items: center;*/
    flex-flow: column;
  }
  .role-span{
    display: inline-block;
    padding: 0px 5px;
  }

</style>
