<template>
  <div class="page-register" >
    <div class="register-header">
      <p class="title">您好，欢迎您注册!</p>
    </div>
    <div class="register-container">
      <div class="register-step-container">
        <el-steps :active="active"  align-center status="process"  finish-status="success">
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
              <div class="step-content p-left">
                <p style="color: #000000">一、供应商在华南理工大学网上注册登记，应具备以下条件:</p>
                <p>（1）具有良好的商业信誉和健全的财务会记制度;</p>
                <p>（2）具有履行合同所必须得设备和专业技术能力;</p>
                <p>（3）有一发缴纳税收和社会保障资金得良好记录;</p>
                <p>（4）参加政府采购活动前三年内，在经营活动中没有重大违纪记录;</p>
                <p style="color: #000000">二、供应商信息由供应商自行登记维护，并对填报资料的真实性复杂，并承担相应的法律责任。</p>
              </div>
            </div>
          </div>
          <div class="step-footer">
            <el-button class="form-submit-btn btn-width-120" @click="handleNext">同意</el-button>
            <el-button class="form-close-btn  btn-width-120" @click="handleDisagree">不同意</el-button>
            <el-button class="form-submit-btn btn-width-120" @click="handleLogin">返回</el-button>
          </div>
        </div>
        <div class="step-container" v-if="active == 1">
          <div class="step-container-wrapper register-form-wrapper">
            <div class="register-form-content">
              <div class="register-form-header">
                <h3>供应商注册信息</h3>
                <p>提示：申报人应如实填写本企业相关信息，申请表中准确地填写，带“<span>必填项*</span>”标记得为必填内容，均要认真。</p>
              </div>
              <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="register-form" size="medium" >
                <el-form-item label="交易主体类型:" prop="supType" class="form-item-inline" >
                  <el-select v-model="form.supType" required placeholder="请选择" clearable>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <p class="form-tips">请选择主体类型</p>
                </el-form-item>
                <el-form-item label="用户名:" prop="creditCode"  class="form-item-inline" >
                  <el-input v-model="form.creditCode" clearable required></el-input>
                  <p class="form-tips">请填写社会统一信用代码</p>
                </el-form-item>
                <el-form-item label="企业名称:" prop="company"  class="form-item-inline">
                  <el-input v-model="form.company" clearable required></el-input>
                  <p class="form-tips">与企业公章相符，不含其他字符</p>
                </el-form-item>
                <el-form-item label="密码:" prop="password"  class="form-item-inline">
                  <el-input v-model="form.password" type="password" auto-complete="new-password" clearable required></el-input>
                  <p class="form-tips">密码由8-16位字母、数字、特殊符号组成</p>
                </el-form-item>
                <el-form-item label="确认密码:" prop="passwordChecked">
                  <el-input v-model="form.passwordChecked" type="password" auto-complete="new-password" clearable required></el-input>
                </el-form-item>
                <el-form-item label="真实姓名:" prop="realName">
                  <el-input v-model="form.realName" clearable required></el-input>
                </el-form-item>
                <el-form-item label="联系人电话/手机号:" prop="telephone">
                  <el-input v-model="form.telephone" clearable required></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱:" prop="email" >
                  <el-input v-model="form.email" clearable required></el-input>
                </el-form-item>
              </el-form>
             <p style="color: #999999;font-size: 12px;text-align: center; margin-left: 120px;">我已注册，现在就 <span style="color: #FF0707;cursor: pointer;" @click="handleLogin">登录</span></p>
            </div>
            <div class="step-footer margin-top-25">
              <el-button class="form-submit-btn btn-width-120" @click="submitForm('form')">完成注册</el-button>
              <el-button class="form-close-btn  btn-width-120" @click="resetForm('form')">重置</el-button>
              <el-button class="form-submit-btn btn-width-120" @click="backStep">上一步</el-button>
            </div>
          </div>
        </div>
        <div class="step-container " v-if="active == 2">
          <div class="finish-wrapper">
            <div class="finish-content">
              <i class="el-icon-circle-check"></i>
              <span>完成注册!</span>
            </div>
            <div class="step-footer">
              <el-button class="form-submit-btn btn-width-120" @click="handleLogin">进入系统</el-button>
              <el-button class="form-close-btn  btn-width-120" @click="backStep">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AccountRegister } from '@/api/sys.login'
import util from '@/libs/util'
export default {
  data () {
    const validateCreditCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空!'))
      }
      setTimeout(() => {
        if (!util.isCreditCode(value)) {
          callback(new Error('请填写正确的统一社会信用代码!'))
        } else {
          callback()
        }
      }, 800)
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空！'))
      }
      setTimeout(() => {
        if (!util.isPwdExp(value)) {
          callback(new Error('密码格式不正确!'))
        } else {
          if (this.form.passwordChecked !== '') {
            this.$refs.form.validateField('passwordChecked')
          }
          callback()
        }
      }, 800)
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
      active: 0,
      options: [
        {
          name: '供应商',
          value: 1
        },
        {
          name: '代理商',
          value: 2
        }
      ],
      form: {
        supType: '',
        creditCode: '',
        company: '',
        password: '',
        passwordChecked: '',
        realName: '',
        telephone: '',
        email: ''
      },
      rules: {
        supType: [
          { required: true, message: '请选择交易主体类型', trigger: 'change' }
        ],
        creditCode: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateCreditCode, trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passwordChecked: [
          { required: true, message: '请再次确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请填写真实姓名', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请填写联系人联系电话', trigger: 'blur' },
          { validator: telePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请填写正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    backStep () {
      if (this.active-- > 2) this.active = 0
    },
    handleNext () {
      this.active = 1
    },
    /**
   * 不同意注册条款返回
   * */
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
    /**
     * 注册
     * @param formName
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            supType: this.form.supType,
            creditCode: this.form.creditCode,
            company: this.form.company,
            password: this.form.password,
            passwordChecked: this.form.passwordChecked,
            realName: this.form.realName,
            telephone: this.form.telephone,
            email: this.form.email
          }
          AccountRegister(params).then((res) => {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.active = 2
          }).catch((err) => {
            this.$message({
              message: err.message,
              type: 'error',
              duration: 5 * 1000
            })
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * 跳转到登录
     */
    handleLogin () {
      this.$router.push('/login')
    }

  }
}
</script>

<style lang="scss">
  $inputBgColor: #f5fafd;
  $inputBorderColor: #b6c5cc;
  .btn-width-120{
    width:120px;
    height:35px;
    padding: 0 !important;
  }
  //form label 样式
  .el-form-item__label{
    color: #333333;
    font-size: 16px;
  }
  .el-input--medium {
    font-size: 16px !important;
  }
  .page-register {
    display: flex;
    flex-flow: column;
    height: 100%;
    background: #ffffff;
    background-size: cover;
    .register-header{
      height: 42px;
      line-height: 42px;
      background: #349BFB;
      color: #ffffff;
      .title{
        padding-left: 150px;
        font-size: 18px;
      }
    }
    .register-container{
      background: #ffffff;
      height: calc(100% - 42px);
      .register-step-container{
        margin-top: 25px;
        padding: 15px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-steps{
          width: 100%;
          margin: 0 260px;
        }
        .el-step__title{
          color: #999999;
          font-weight: normal;
          font-size: 14px;
        }
        .el-step__head.is-process {
          color: #349BFB ;
          border-color: #349BFB;
          .el-step__line{
            background-color: #349BFB;
          }
        }
        .el-step__title.is-process {
          color: #349BFB !important;
        }
        .el-step__title.is-success {
          color: #67C23A !important;
        }
      }
      .page-register-content{
        height: calc(100% - 150px);
        .step-container{
          display: flex;
          flex-flow: column;
          .step-container-wrapper{
            margin:15px 45px;
            .step-container-content{
              display: flex;
              flex-flow: column;
              padding: 45px;
              margin: 20px 280px;
              border: 1px solid #E0E0E0;
              border-radius: 6px;
              h3{
                text-align: center;
                padding-bottom: 25px;
                color: #333333;
              }
              .step-content{
                padding: 0 45px;
                p{
                  line-height: 30px;
                  color: #333333;
                  text-align: left;
                }
              }
            }
          }
          .register-form-wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            .register-form-content{
              display: flex;
              flex-flow: column;
              padding:25px 45px;
              margin: 0 280px;
              border: 1px solid #E0E0E0;
              border-radius: 6px;
              .register-form-header{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-flow: column;
                h3{
                  line-height: 32px;
                  padding-bottom: 15px;
                  color: #333333;
                }
                p{
                  color: #999999;
                  font-size: 12px;
                  padding-bottom: 15px;
                  span{
                    color: #ff0000;
                  }
                }
              }
              .register-form{
                .el-input{
                  width: 300px;
                }
                .form-item-inline{
                  .el-form-item__content{
                    display: flex;
                    .form-tips{
                      color: #FF0707;
                      font-size: 12px;
                      white-space: nowrap;
                      padding-left: 15px;
                    }
                  }
                }
              }
            }
            .margin-top-25{
              margin-top: 25px;
            }

          }
          .step-footer{
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .finish-wrapper{
            width: 100%;
            padding-top: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            .finish-content{
              padding: 45px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 120px;
              i{
                font-size: 30px;
                color: #409EFF;
              }
              span{
                display: inline-block;
                padding-left: 20px;
                font-size: 18px;
                color: #349BFB;
              }
            }
          }

        }
      }
    }
    .form-submit-btn{
      background: #349BFB;
      border-radius: 4px;
      color: #fff;
    }
    .form-close-btn{
      background: #EBEBEB;
      border-radius: 4px;
      color: #666666;
    }
  }
</style>
