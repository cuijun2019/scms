<template>
  <div class="page-register" >
    <div class="register-header">
      <p class="title">您好，欢迎您注册</p>
    </div>
    <div class="register-container">
      <div class="register-step-container">
        <el-steps :active="active"  align-center process-status="wait" finish-status="success">
          <el-step title="阅读注册需知"></el-step>
          <el-step title="填写基本信息"></el-step>
          <el-step title="完成注册登录"></el-step>
        </el-steps>
      </div>
      <div class="page-register-content">
        <div class="step-container" v-if="active == 0">
          <div class="step-container-wrapper">
            <div class="step-container-content">
              <h3>供应商注册条款</h3>
              <div class="step-content">
                <p>一、供应商在华南理工大学晚上注册登记，应具备以下条件:</p>
                <p>（1）具有良好的商业信誉和健全的财务会记制度;</p>
                <p>（2）具有履行合同所必须得设备和专业技术能力;</p>
                <p>（3）有一发缴纳税收和社会保障资金得良好记录;</p>
                <p>（4）参加政府采购活动前三年内，在经营活动中没有重大违纪记录;</p>
                <p>二、供应商信息由供应商自行登记维护，并对填报资料的真实性复杂，并承担相应的法律责任。</p>
              </div>
            </div>
          </div>
          <div class="step-footer">
            <el-button type="danger" size="small" @click="handleNext">同意</el-button>
            <el-button type="primary" size="small" @click="handleDisagree">不同意</el-button>
            <el-button type="primary" size="small" @click="handleLogin">返回</el-button>
          </div>
        </div>
        <div class="step-container" v-if="active == 1">
          <div class="step-container-wrapper register-form-wrapper">
            <div class="register-form-header">
              <h3>供应商注册信息</h3>
              <p>提示：申报人应如实填写本企业相关信息，申请表中准确地填写，带“<span>必填项*</span>”标记得为必填内容，均要认真。</p>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="register-form" size="small" >
              <el-form-item label="用户名:" prop="name" required >
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="企业名称:" prop="name" required>
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="密码:" prop="pass" required>
                <el-input v-model="ruleForm.pass"></el-input>
              </el-form-item>
              <el-form-item label="默认密码:" prop="checkPass" required>
                <el-input v-model="ruleForm.checkPass"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名:" prop="name" required>
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="联系人手机号:" prop="name" required>
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱:" prop="name" required>
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item class="register-btn">
                <el-button type="primary" @click="submitForm('ruleForm')">完成注册</el-button>
                <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="info" @click="backStep">上一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="step-container " v-if="active == 2">
          <div class="finish-wrapper">
            <div class="finish-content">
              <i class="el-icon-circle-check"></i>
              <span>完成注册!</span>
            </div>
            <div class="step-footer">
              <el-button type="primary" size="small" @click="handleLogin">进入系统</el-button>
              <el-button type="primary" size="small" @click="backStep">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import localeMixin from '@/locales/mixin.js'
export default {
  mixins: [
    localeMixin
  ],
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      active: 0,
      ruleForm: {
        name: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            username: this.formLogin.username,
            password: this.formLogin.password
          })
            .then(() => {
              // 重定向对象不存在则返回顶层路径
              this.$router.replace(this.$route.query.redirect || '/')
            })
        } else {
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    },
    backStep () {
      if (this.active-- > 2) this.active = 0
    },
    handleNext () {
      this.active = 1
    },
    handleDisagree () {
      this.$confirm('确定不同意供应商注册条款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleLogin () {
      this.$router.push('/login')
    },
    submitForm (formName) {
      this.active = 2
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }

  }
}
</script>

<style lang="scss">
  $inputBgColor: #f5fafd;
  $inputBorderColor: #b6c5cc;
  .page-register {
    display: flex;
    flex-flow: column;
    height: 100%;
    background: #ffffff;
    background-size: cover;
    .register-header{
      height: 55px;
      line-height: 55px;
      background: #3d8ccf;
      color: #ffffff;
      .title{
        padding-left: 15px;
      }
    }
    .register-container{
      background: #4b8bdd30;
      height: calc(100% - 55px);
      .register-step-container{
        padding: 15px 0;
        .el-step__title{
          color: #333333;
          font-weight: normal;
        }
      }
      .page-register-content{
        height: calc(100% - 150px);
        .step-container{
          display: flex;
          flex-flow: column;
          .step-container-wrapper{
            margin: 45px;
            border-radius: 8px;
            box-shadow: 1px 1px 6px #4b8bdd;
            .step-container-content{
              display: flex;
              flex-flow: column;
              padding: 45px;
              margin: 20px;
              border: 1px solid #ccc;
              border-radius: 4px;
              h3{
                text-align: center;
                padding-bottom: 45px;
              }
              .step-content{
                padding: 0 45px;
                p{
                  line-height: 32px;
                }
              }
            }
          }
          .register-form-wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            .register-form-header{
              display: flex;
              justify-content: center;
              align-items: center;
              flex-flow: column;
              padding: 20px;
              h3{
                line-height: 32px;
              }
              p{
                color: #0000007a;
                span{
                  color: #ff0000;
                }
              }
            }
            .register-form{
              width: 40%;
              padding: 20px 0 45px;
              .register-btn{
                padding-top: 45px;
              }
            }
          }
          .step-footer{
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .finish-wrapper{
            width: 100%;
            padding-top: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            .finish-content{
              padding: 45px;
              display: flex;
              justify-content: center;
              align-items: center;
              i{
                font-size: 30px;
                color: #409EFF;
              }
              span{
                display: inline-block;
                padding-left: 20px;
                font-size: 18px;
              }
            }
          }

        }
      }
    }
  }
</style>
