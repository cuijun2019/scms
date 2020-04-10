<template>
  <div class="container color-white">
    <div class="custom-header">
      <i class="line-icon"></i>
      <span class="header-title">基本信息</span>
    </div>
    <div class="custom-form-con con-center">
        <el-form :model="form" :rules="rules" ref="form" label-width="110px"  size="mini" class="form-480">
          <div class="form-container">
            <el-form-item label="角色名称：" prop="name">
              <el-input v-model="form.name"  placeholder="管理员" :disabled="listParams.type === 2 ? true : false" clearable required ></el-input>
            </el-form-item>
            <el-form-item label="角色描述：" prop="description">
              <el-input v-model="form.description" placeholder="admin" clearable required></el-input>
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
            <el-form-item label="菜单权限：" prop="permissions">
              <el-select v-model="form.permissions" ref="menuTree" filterable :filter-method='dataFilter' @clear="handleClear" placeholder="请选择" clearable required>
                <el-option
                  :value="menuData"
                  style="height: auto;padding: 0">
                  <el-tree
                    :filter-node-method="filterNode"
                    :data="treeData"
                    show-checkbox
                    node-key="brandItemId"
                    ref="tree"
                    highlight-current
                    :props="defaultProps"
                    @check-change="handleCheckChange">
                  </el-tree>
                </el-option>
              </el-select>
              <!--:render-content="renderContent"-->
            </el-form-item>
            <el-form-item class="custom-form-btn">
              <el-button class="form-submit-btn btn-width-90" @click="submitForm('form')">保存</el-button>
              <el-button class="form-reset-btn btn-width-90" @click="handleResetForm">重置</el-button>
              <el-button class="form-close-btn btn-width-90" @click="handleClose">关闭</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>

import {
  FetchAllPermission
} from '@/api/sys.system'
import util from '@/libs/util'
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
        permissions: []
      },
      rules: {
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写角色描述', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        permissions: [
          { required: true, message: '请选择用户权限', trigger: 'blur' }
        ]
      },
      selectOrg: {
        orgsId: []
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
    console.log('==========4444444', this.$route.params.cargoId)
    if (this.$route.params.cargoId) {
      this.fetchDetailData(this.$route.params.cargoId)
    }
    this.fetchAllPermission()
  },
  filters: {},
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
          // switch (val.type) {
          //   case 1:
          //     this.$set(this.columns, 0, { title: '待办类型', key: 'date' })
          //     this.$set(this.columns, 1, { title: '待办主题', key: 'name' })
          //     break
          //   case 2:
          //     this.$set(this.columns, 0, { title: '已办类型', key: 'date' })
          //     this.$set(this.columns, 1, { title: '已办主题', key: 'name' })
          //     break
          // }
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

    fetchAllPermission (params) {
      FetchAllPermission(params).then(res => {
        console.log('============,tree', res)
        let treeData = []
        res.forEach(item => {
          let obj = item.permission
          obj.children = item.list
          treeData.push(obj)
        })
        this.treeData = treeData
      }).catch((err) => {
        // 显示提示
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    renderContent (h, { node, data, store }) {
      return (
        <span>
          <i class={data.icon}></i>
          <span class="tree-text">{data.menuName}</span>
        </span>
      )
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
      // this.form.itemCode = ''
      // this.form.itemName = ''
      this.$refs.tree.setCheckedKeys([])
    },
    handleCheckChange (data, checked, indeterminate) {
      // 获取当前选择的id在数组中的索引
      // const indexs = this.selectOrg.orgsId.indexOf(data.brandItemId)
      // // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
      // if (indexs < 0 && this.selectOrg.orgsId.length === 1 && checked) {
      //   this.$message({
      //     message: '只能选择一个货物品目！',
      //     type: 'error',
      //     showClose: true
      //   })
      //   // 设置已选择的节点为false 很重要
      //   this.$refs.tree.setChecked(data, false)
      // } else if (this.selectOrg.orgsId.length === 0 && checked) {
      //   // 发现数组为空 并且是已选择
      //   // 防止数组有值，首先清空，再push
      //   this.selectOrg.orgsId = []
      //   this.selectOrg.orgsId.push(data.brandItemId)
      //   this.form.itemCode = data.itemCode
      //   this.form.itemName = data.itemName
      //   this.$refs.goodsTree.blur()
      // } else if (indexs >= 0 && this.selectOrg.orgsId.length === 1 && !checked) {
      //   // 再次直接进行赋值为空操作
      //   this.selectOrg.orgsId = []
      //   // this.form.itemCode = ''
      //   // this.form.itemName = ''
      // }
    },
    submitForm (formName) {
      console.log('=========3333333', this.form.roles)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let roles = []
          this.form.roles.forEach(item => {
            roles.push({
              id: item
            })
          })
          let params = {
            username: this.form.username,
            password: this.form.password,
            company: this.form.company,
            createTime: this.form.createTime,
            email: this.form.email,
            enabled: this.form.enabled,
            fullname: this.form.fullname,
            is_delete: this.form.is_delete,
            sex: this.form.sex,
            telephone: this.form.telephone,
            update_time: this.form.update_time,
            roles: roles
          }
          console.log('====33', params)
          if (this.listParams.type === 1) { // 新增用户
            // console.log(999, this.$route.params.cargoId)
            // params.cargoId = this.form.cargoId
            FetchUser('post', params).then((res) => {
              console.log(888, res)
              this.$message({
                message: '新建用户成功！',
                type: 'success',
                duration: 3 * 1000
              })
              this.resetForm('form')
            }).catch((err) => {
              // 显示提示
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5 * 1000
              })
            })
          } else if (this.listParams.type === 2) { // 编辑用户
            params.id = this.$route.params.cargoId
            FetchUser('put', params).then((res) => {
              this.$message({
                message: '修改用户信息成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.resetForm('form')
            }).catch((err) => {
              // 显示提示
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5 * 1000
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
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
      let tagName = this.current
      this.close({ tagName })
    }
  }
}
</script>

<style lang="scss">

</style>
