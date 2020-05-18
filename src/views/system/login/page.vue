<template>
  <div class="page-login" @keyup="KeyUpEnter">
      <div class="login-con login-bg-img">
        <div class="login-box">
          <div class="login-content">
            <div class="login-wrapper">
              <div class="login-logo-con">
                <img src="@/assets/images/logo.png" alt="">
              </div>
              <p class="login-title">欢迎登录协议供货管理系统</p>
              <div>
                <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin"
                         size="default" class="logo-form" @submit="submit">
                  <el-form-item prop="username">
                    <el-input type="text" v-model="formLogin.username" placeholder="请输入账号" class="login-input">
                      <img className='input-icon' slot="prefix" src='@/assets/images/YH.png' alt=""/>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input type="password" v-model="formLogin.password" placeholder="请输入密码" class="login-input">
                      <img className='input-icon' slot="prefix" src='@/assets/images/MM.png' alt=""/>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="code" class="verCode-wrap">
                    <el-input type="text" v-model="formLogin.code" placeholder="请输入验证码" class="login-input">
                      <img className='input-icon' slot="prefix" src='@/assets/images/YZM.png' alt=""/>
                      <template slot="append">
                        <!--@click="getVerifyCode"-->
                        <img class="login-code"  :src="`${verCode.src}`"
                             style="width: 130px;" @click="getVerifyCode">
                      </template>
                    </el-input>
                  </el-form-item>

                  <el-form-item class="remember-div">
                    <el-checkbox v-model="remember">记住密码</el-checkbox>
                  </el-form-item>

                  <el-form-item>
                    <el-button  @click="submit" class="button-login">登录</el-button>
                  </el-form-item>

                  <el-form-item>
                    <div
                      class="page-login--options"
                      flex="main:justify cross:center">
                      <div>
                        没有账户， <span class="register" @click="handleRegister">立即注册</span>
                      </div>
                      <span class="forget" @click="handleForgot"> 忘记密码</span>
                    </div>
                  </el-form-item>

                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      remember: true,
      vcUserName: '',
      dtCreateTime: '',
      noticeHtml: '',
      users: [
        {
          name: '管理员',
          username: 'admin',
          password: 'admin'
        },
        {
          name: '编辑',
          username: 'editor',
          password: 'editor'
        },
        {
          name: '用户1',
          username: 'user1',
          password: 'user1'
        }
      ],
      verCode: {
        src: '/api/getCode',
        imgDataURL: '',
        vcode: '',
        captchaId: ''
      },
      loginLoading: false,
      // 表单
      formLogin: {
        username: 'admin',
        password: 'admin',
        code: ''
      },
      // 校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    /**
     * 获取二维码
     * */
    getVerifyCode () {
      this.verCode.src = this.verCode.src + '?date = ' + new Date()
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
     * 回车提交表单
     * @param e
     * */
    KeyUpEnter (e) {
      const ev = e || window.event
      if (ev.keyCode === 13) {
        this.submit(e)
      }
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit (e) {
      e.preventDefault()
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            username: this.formLogin.username,
            password: this.formLogin.password,
            code: this.formLogin.code
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
    handleRegister () {
      this.$router.push('/register')
    },
    handleForgot () {
      this.$router.push('/forgot')
    }

  }
}
</script>

<style lang="scss">
  $inputBgColor: #f5fafd;
  $inputBorderColor: #b6c5cc;
  .page-login {
    width: 100%;
    height: 100%;
    display: flex;
    /*justify-content: center;*/
    align-items: flex-start;
    box-sizing: border-box;
    /*padding-top: 18vh;*/
    .login-bg-img{
      width: 100%;
      height: 100%;
      background: #fff url('~@/assets/images/login_bg.png') no-repeat center center;
      background-size: cover;
    }
    .login-con{
      position: relative;
      .login-box{
        position: absolute;
        top: 0;
        left: 55%;
        right: 0;
        bottom: 0;
        background-color: #ffffff;
        .login-content{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-flow: column;
          box-sizing: border-box;
          padding-top: 15vh;
          .login-wrapper{
            width: 75%;
            .login-logo-con{
              width: 250px;
             margin-bottom: 30px;
                img{
                  display: inline-block;
                  max-width: 100%;
                }
            }
            .login-title{
              color: #000000;
              font-size: 26px;
              line-height: 0;
              margin-bottom: 56px;
            }
            .login-input {
              .el-input__inner {
                padding-left: 40px;
                border-top: none;
                border-right: none;
                border-bottom: 1px solid #E5E5E5;
                border-left: none;
                border-radius: 0px;
              }
              .el-input-group__append, .el-input-group__prepend{
                background: transparent;
                border-top: none;
                border-right: none;
                border-bottom: 1px solid #E5E5E5;
                border-left: none;
              }
            }
            .input-icon {
              width: 16px;
              display: block;
              margin-right: 5px;
            }
            .el-input__prefix {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              width: 40px;
              &:after{
                position: absolute;
                content: '|';
                right: 10px;
              }
            }

            .logo-form {
              width: 100%;
              /*padding: 40px 40px 0;*/
            }
            .button-login {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height:40px;
              color: #ffffff;
              background:rgba(59,157,248,1);
              box-shadow:0px 5px 15px 0px rgba(72,157,252,0.7);
            }
            .el-form-item__error {
              position: static;
            }
            .verCode-wrap {
              .el-input-group__append {
                padding: 0;
                height: 100%;
                .login-code {
                  padding: 0;
                  width: 120px;
                  /*height: 38px;*/
                  display: block;
                  /*border-radius: 4px;*/
                  border-top-left-radius: 0;
                  border-bottom-left-radius: 0;
                }
              }
            }
            .remember-div{
              text-align: right;
              margin: -20px 0 0 0 !important;
              .el-checkbox__label{
                font-weight: normal;
              }
            }

          }
        }
      }
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      /*margin-bottom: 15px;*/
      color: #A8ACB9;
      span{
        cursor: pointer;
      }
      .register{
        color: #489DFC;
      }
      .forget{
        display: inline-block;
        line-height: 23px;
        border-bottom:1px solid #E5E5E5;
      }
    }

  }
</style>
