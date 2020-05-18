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
                        <label>角色名称:</label>
                        <el-input
                          size="medium"
                          class="search-input"
                          placeholder="请输入内容"
                          v-model="searchData.roleName"
                          clearable>
                        </el-input>
                      </li>
                      <li class="search-item">
                        <label>状态:</label>
                        <el-select class="search-input" v-model="searchData.statusSearch" clearable placeholder="请选择" size="medium">
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
                <el-button v-if="item.menuCode =='systemRoleCreate' " class="tool-basic-btn" size="mini" @click="handleAdd">{{item.menuName}}</el-button>
                <el-button v-else-if="item.menuCode =='systemRoleCheckOrEdit'"  size="mini" class="tool-edit-btn" @click="handleEdit">{{item.menuName}}</el-button>
                <!--<el-button v-else-if="item.menuCode =='systemRoleDelete'" size="mini" class="tool-delete-btn" @click="handleDelete">{{item.menuName}}</el-button>-->
                <el-popover
                  placement="left"
                  width="250"
                  trigger="manual"
                  v-model="visible"
                  v-else-if="item.menuCode =='systemRolePermissions'"
                >
                  <div style="width: 100%;height: 300px;overflow-y: auto">
                    <el-tree
                      :filter-node-method="filterNode"
                      :data="treeData"
                      show-checkbox
                      node-key="permId"
                      ref="tree"
                      highlight-current
                      :props="defaultProps"
                      @node-click="handleNodeClick"
                      @check-change="handleCheckChange">
                    </el-tree>
                  </div>
                  <div class="role-btn">
                    <el-button size="mini" class="save-btn" @click="handleChangeUserPermission">保存</el-button>
                    <el-button size="mini" class="close-btn" @click="handleCloseUserPermission">关闭</el-button>
                  </div>
                  <el-button size="mini" class="tool-roles-btn" slot="reference"  @click="handleEditPermission">{{item.menuName}}</el-button>
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
                prop="name"
                label="角色名称"
                align="center">
              </el-table-column>
              <el-table-column
                prop="description"
                label="角色描述"
                align="center">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                :formatter="formatter">
              </el-table-column>
              <el-table-column
                prop="attachId"
                label="创建人"
                align="center">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
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
  import {FetchRole, FetchAllPermission, FetchPermissionBtn, FetchUpdateRolePermissions} from '@/api/sys.system'
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'system-roles',
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
          roleName:'',
          statusSearch:''
        },
        userDtos: [],
        loading: false,
        pageInfo: {
          pageSize: this.GLOBAL.pageSize,
          total: 0,
          currentPage: 1
        },
        boxParams: {},
        dialogVisible: false,
        multipleSelection: [],
        visible:false,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        currentData:[]
      }
    },
    created () {
      this.fetchList()
      this.fetchAllPermission()
    },
    mounted () {
      this.$nextTick(() => { // 关闭当前右侧的 tab 页
        this.closeRight({pageSelect: '/system/role'})
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
          roleName:'',
          statusSearch:''
        }
        this.fetchList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      fetchList () {
        this.loading = true
        let searchParams ={}
        if(this.searchData.roleName){
          searchParams.roleName = this.searchData.roleName
        }
        if(this.searchData.statusSearch){
          searchParams.statusSearch = this.searchData.statusSearch
        }
        FetchRole('get',Object.assign({
          currentPage: this.pageInfo.currentPage || 1,
          pageSize: this.pageInfo.pageSize,
          // isDelete:2
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
      formatterTime (row, column) {
        return row.createTime ?  util.formatTime(row.createTime) :''
      },
      handleEdit (index, row) {
        if(this.multipleSelection.length === 1){
          this.$router.push({ name: 'system-role-edit' , params: { data: this.multipleSelection[0]}})
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
            FetchRole('delete', this.multipleSelection[0].id).then((res) => {
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
       *获取所有菜单
       * */
      fetchAllPermission (params) {
        FetchAllPermission(params).then(res => {
          if (res.message === 'success') {
            let respondData = res.data
            let treeData = []
            respondData.forEach(item => {
              let obj = item.permission
              obj.children = []
              item.list.forEach(val => {
                let childObj = val.permission
                childObj.children = val.list
                obj.children.push(childObj)
              })
              treeData.push(obj)
            })
            this.treeData = treeData
          }
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      },
      /**
       * 点击请求菜单下的功能按钮
       * @param data
       * @param node
       * @param tree
       */
      handleNodeClick (data, node, tree) {
        if (node.isLeaf) {
          this.fetchPermissionBtn(data)
        }
      },
      /**
       * 请求菜单下的功能按钮
       * @param data
       */
      fetchPermissionBtn (data, parentNode) {
        FetchPermissionBtn(data.permId).then(newChild => {
          if (newChild.message === 'success') {
            let respondData = newChild.data
            this.$set(data, 'children', respondData)
          }
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      },
      dataFilter (val) {
        this.$refs.tree[0].filter(val)
      },
      filterNode (value, data) {
        if (!value) return true
        return data.itemName.indexOf(value) !== -1
      },
      handleCheckChange (data, checked, indeterminate) {
      },
      /**
       * 权限配置
       * */
      handleEditPermission(){
        if(this.multipleSelection.length === 1){
          this.currentData = this.multipleSelection[0]
          let permissions = this.multipleSelection[0].permissions
          let permissionsData = []
          permissions.forEach(item =>{
            permissionsData.push(item.permId)
          })
          this.visible = !this.visible
          this.$nextTick(() => { //
            this.$refs.tree[0].setCheckedKeys(permissionsData)
          })
        }else{
          this.$message({
            type: 'info',
            message: '请选择一条需要配置权限的数据！'
          })
        }

      },
      handleChangeUserPermission(){
        let permissionsIds = [].concat(this.$refs.tree[0].getCheckedKeys(), this.$refs.tree[0].getHalfCheckedKeys())
        let permissions = []
        permissionsIds.forEach(item => {
          permissions.push({
            permId: item
          })
        })
        let params ={
          id:this.currentData.id,
          createTime:"2020-04-01",
          status:this.currentData.status,
          description:this.currentData.description,
          name:this.currentData.name,
          permissions: permissions
        }
        FetchUpdateRolePermissions(params).then((res) => {
          if (res.message === 'success') {
            this.$message({
              message: '修改角色权限成功！',
              type: 'success'
            })
            this.visible = false
            this.currentData = {}
            this.$refs.tree[0].setCheckedKeys([])
            this.fetchList()
          }
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      },
      handleCloseUserPermission(){
        this.currentData = {}
        this.$refs.tree[0].setCheckedKeys([])
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
        this.$router.push({ path: '/system/role-add' })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
