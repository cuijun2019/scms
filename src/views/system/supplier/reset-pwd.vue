<!--suppress ALL -->
<template>
  <d2-container class="page">
    <div class="container color-white">
      <div class="form-content">
        <div class="custom-header">
          <i class="line-icon"></i>
          <span class="header-title">修改密码</span>
        </div>
        <div class="form-wrapper">
          <el-form :model="form" :rules="rules" ref="form" label-width="180px"  size="medium">
            <el-form-item label="原密码：" prop="oldPassword" class="supplier-item">
              <el-input v-model="form.oldPassword" auto-complete="new-password" type="password"  class="supplier-input"  placeholder="原来的密码"></el-input>
              <span> 密码由 8-16位字母、数字、特殊符号组成！</span>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword" class="supplier-item">
              <el-input v-model="form.newPassword" auto-complete="new-password" type="password" class="supplier-input" placeholder="新密码"></el-input>
              <span> 密码由 8-16位字母、数字、特殊符号组成！</span>
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkPass" class="supplier-item">
              <el-input v-model="form.checkPass" auto-complete="new-password" type="password" class="supplier-input" placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item class="form-btn">
              <el-button class="form-submit-btn btn-width-120" @click="submitForm('form')" >保存</el-button>
              <el-button class="form-reset-btn btn-width-120"  @click="resetForm ('form')">重置</el-button>
              <el-button class="form-close-btn btn-width-120" @click="handleClose">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </d2-container>
</template>
<script>
  import {FetchUpdatePassword} from '@/api/sys.supplier'//api
  import util from '@/libs/util'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'supplier-reset-pwd',
    components: {},
    data () {
      var validatePass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空！'))
        }
        setTimeout(() => {
          if (!util.isPwdExp(value)) {
            callback(new Error('密码格式不正确!'))
          } else {
            if (this.form.checkPass !== '') {
              this.$refs.form.validateField('checkPass');
            }
            callback();
          }
        }, 800)
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        filename: __filename,
        form: {
          oldPassword: '',
          newPassword: '',
          checkPass: ''
        },
        rules: {
          oldPassword: [
            { required: true, message: '请填写原密码', trigger: 'blur' },
            { min: 6, message: '不少于6个字符', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请填写新密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      }
    },
    created () {
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
      ...mapActions('d2admin/account', [
        'logout'
      ]),
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              oldPassword: this.form.oldPassword,
              newPassword: this.form.newPassword
            }
            FetchUpdatePassword(params).then((res) => {
              console.log(888, res)
              this.$message({
                message: '重置密码成功,将会重新登录！',
                type: 'success'
              })
              this.logout({
                confirm: true
              })
              // this.handleClose()
            }).catch((err) => {
              this.$message({
                message: err.message,
                type: 'error'
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleClose () {
        let tagName = this.current
        this.close({ tagName })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supplier-item{
    .el-form-item__content{
      /*display: flex !important;*/
      span{
        color: #999999;
        padding-left: 8px;
        font-size: 12px;
      }
    }
  }
  .form-wrapper{
    padding: 15px;
    margin-top: 65px;
    margin-left: 180px;
    .el-upload__tip{
      display: inline-block;
      padding-left: 15px;
      color: #999999;
    }
  }
  .supplier-input{
    width: 412px;
  }
  .supplier-textarea{
    width: 740px;
  }
  .form-btn{
    padding-top: 15px;
  }
</style>
