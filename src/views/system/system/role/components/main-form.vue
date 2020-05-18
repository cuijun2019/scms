<template>
  <div class="container color-white">
    <div class="custom-header">
      <i class="line-icon"></i>
      <span class="header-title">基本信息</span>
    </div>
    <div class="custom-form-con con-center">
        <el-form :model="form" :rules="rules" ref="form" label-width="110px"  size="medium" class="form-480">
          <div class="form-container">
            <el-form-item label="角色名称：" prop="name">
              <el-input v-model="form.name"  placeholder="管理员" :disabled="listParams.type === 2 ? true : false" clearable required ></el-input>
            </el-form-item>
            <el-form-item label="角色描述：" prop="description">
              <el-input v-model="form.description" placeholder="admin" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-select v-model="form.status" clearable placeholder="请选择状态" >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单权限：" prop="permissions" class="role-tree">
              <el-tree
                :filter-node-method="filterNode"
                :data="treeData"
                show-checkbox
                node-key="permId"
                ref="tree"
                highlight-current
                :props="defaultProps"
                @check-change="handleCheckChange">
              </el-tree>
            </el-form-item>
            <el-form-item class="custom-form-btn">
              <el-button class="form-submit-btn btn-width-120" @click="submitForm('form')">保存</el-button>
              <!--<el-button class="form-reset-btn btn-width-120" @click="handleResetForm">重置</el-button>-->
              <el-button class="form-close-btn btn-width-120" @click="handleClose">关闭</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>

import { FetchAllPermission, FetchRole, FetchUpdateRolePermissions } from '@/api/sys.system'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'main-form',
  components: {
  },
  props: {
    listParams: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      name: '',
      filename: '',
      loading: false,
      options: [
        {
          value: 1,
          label: '激活'
        }, {
          value: 2,
          label: '冻结'
        }],
      form: {
        name: '',
        description: '',
        status: '',
        createTime: '2020-04-01',
        permissions: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        permissions: [
          { required: true, message: '请选择菜单权限', trigger: 'blur' }
        ]
      },
      menuData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      }
    }
  },
  created () {
    let editData = this.$route.params.data
    if (editData) {
      this.form = editData
      let permissions = editData.permissions
      let permissionsData = []
      permissions.forEach(item => {
        permissionsData.push(item.permId)
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(permissionsData)
      })
    }
    this.fetchAllPermission()
  },
  filters: {},
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
        }
      }

    }

  },
  computed: {
    ...mapState('d2admin/page', [
      'opened',
      'current' // 用户获取当前页面的地址，用于关闭
    ])
  },
  methods: {
    ...mapActions('d2admin/page', [
      'close'
    ]),
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

    dataFilter (val) {
      this.$refs.tree.filter(val)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.itemName.indexOf(value) !== -1
    },
    handleClear (val) {
      this.selectOrg.orgsId = []
      this.$refs.tree.setCheckedKeys([])
    },
    handleCheckChange (data, checked, indeterminate) {
      this.form.permissions = this.$refs.tree.getCheckedKeys()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let permissionsIds = [].concat(this.$refs.tree.getCheckedKeys(), this.$refs.tree.getHalfCheckedKeys())
          let permissions = []
          permissionsIds.forEach(item => {
            permissions.push({
              permId: item
            })
          })
          let params = {
            name: this.form.name,
            description: this.form.description,
            status: this.form.status,
            createTime: '2020-04-01',
            permissions: permissions
          }
          if (this.listParams.type === 1) { // 新增角色
            FetchRole('post', params).then((res) => {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.resetForm('form')
              this.handleClose()
            }).catch((err) => {
              this.$message({
                message: err.message,
                type: 'error'
              })
            })
          } else if (this.listParams.type === 2) { // 编辑用户
            let permissionsIds = [].concat(this.$refs.tree.getCheckedKeys(), this.$refs.tree.getHalfCheckedKeys())
            let permissions = []
            permissionsIds.forEach(item => {
              permissions.push({
                permId: item
              })
            })
            let params = {
              id: this.$route.params.data.id,
              createTime: '2020-04-01',
              status: this.form.status,
              description: this.form.description,
              name: this.form.name,
              permissions: permissions
            }
            FetchUpdateRolePermissions(params).then((res) => {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.resetForm('form')
              this.handleClose()
            }).catch((err) => {
              this.$message({
                message: err.message,
                type: 'error'
              })
            })
          }
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleResetForm () {
      this.resetForm('form')
    },
    handleClose () {
      this.$store.dispatch('d2admin/menu/headerActivePathSet', '/system')
      this.$router.push({ path: '/system/role' })
      let tagName = this.current
      this.close({ tagName })
    }
  }
}
</script>

<style lang="scss">
  .el-tree-node__label{
    font-size: 16px;
  }
</style>
