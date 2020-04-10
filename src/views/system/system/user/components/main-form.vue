<template>
  <div class="container color-white">
    <div class="custom-header">
      <i class="line-icon"></i>
      <span class="header-title">基本信息</span>
    </div>
    <div class="custom-form-con con-center">
        <el-form :model="form" :rules="rules" ref="form" label-width="110px"  size="mini" class="form-480">
          <div class="form-container">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="form.username" placeholder="admin" :disabled="listParams.type === 2 ? true : false" clearable required></el-input>
            </el-form-item>
            <el-form-item label="用户姓名：" prop="fullname">
              <el-input v-model="form.fullname"  placeholder="管理员"  clearable required ></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="form.password" placeholder="密码" clearable required></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别" clearable required>
                <el-option label="女" value="女"></el-option>
                <el-option label="男" value="男"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在公司：" prop="company">
              <el-input v-model="form.company" placeholder="请填写所在公司" clearable required></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请填写联系电话" clearable required></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="form.email" type="email" placeholder="请填写邮箱地址" clearable required></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="enabled">
              <el-select v-model="form.enabled" clearable placeholder="请选择状态" >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="拥有角色：" prop="roles">
              <el-select v-model="form.roles" multiple collapse-tags placeholder="请选择角色" clearable required>
                <el-option
                  v-for="item in GLOBAL.roleType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
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
  FetchUser,
  FetchUpdateUser
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
    const telePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系电话不能为空!'))
      }
      setTimeout(() => {
        if (!util.isMobileTelExp(value)) {
          callback(new Error('请填写正确的手机或电话号码!'))
        } else {
          callback()
        }
      }, 800)
    }
    return {
      name: '',
      filename: '',
      loading: false,
      options: [
        {
          value: true,
          label: '激活'
        }, {
          value: false,
          label: '冻结'
        }],
      form: {
        username: '',
        password: '',
        company: '',
        createTime: '',
        email: '',
        enabled: '',
        fullname: '',
        is_delete: '',
        sex: '',
        telephone: '',
        update_time: '',
        roles: []
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写用户密码', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请填写所在公司', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        enabled: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        fullname: [
          { required: true, message: '请填写用户姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        telephone: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { validator: telePhone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      this.fetchDetailData(this.$route.params.id)
    }
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
    fetchDetailData (id) {
      FetchUser('get', id, true).then((res) => {
        console.log('=====获取用户详情', res)
        this.form = res
        let roles = []
        res.roles.forEach(item => {
          roles.push(item.id)
        })
        this.form.roles = roles
      }).catch((err) => {
        // 显示提示
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
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
            createTime: '2020-04-01',
            email: this.form.email,
            enabled: this.form.enabled,
            fullname: this.form.fullname,
            is_delete: 2,
            sex: this.form.sex,
            telephone: this.form.telephone,
            update_time: '2020-04-01',
            roles: roles
          }
          console.log('====33', params)
          if (this.listParams.type === 1) { // 新增用户
            FetchUser('post', params).then((res) => {
              this.$message({
                message: '新建用户成功！',
                type: 'success',
                duration: 3 * 1000
              })
              this.resetForm('form')
              this.$store.dispatch('d2admin/menu/headerActivePathSet', '/system')
              this.$router.push({ path: '/system/user' })
              let tagName = this.current
              this.close({ tagName })
            }).catch((err) => {
              // 显示提示
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5 * 1000
              })
            })
          } else if (this.listParams.type === 2) { // 编辑用户
            params.id = this.$route.params.id
            FetchUpdateUser(params).then((res) => {
              this.$message({
                message: '修改用户信息成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.resetForm('form')
              this.$store.dispatch('d2admin/menu/headerActivePathSet', '/system')
              this.$router.push({ path: '/system/user' })
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
