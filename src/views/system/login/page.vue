<template>
  <div class="page-login" @keyup="KeyUpEnter">
    <div >
      <div class="login-logo">
        <p class="login-title">欢迎登录供应商管理系统！</p>
      </div>
      <!-- 表单 -->
      <div class="loginBox">
        <div class="loginBoxLeft">
          <img src="@/assets/images/logoBoxLeft.jpg" alt=""></div>
        <div class="loginBoxRight">
          <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin"
                   size="default" class="logoForm" @submit="submit">
            <el-form-item prop="username">
              <el-input type="text" v-model="formLogin.username" placeholder="用户名" class="loginInput">
                <img className='inputIcon' slot="prefix" src='@/assets/images/user_icon.png' alt=""/>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formLogin.password" placeholder="密码" class="loginInput">
                <img className='inputIcon' slot="prefix" src='@/assets/images/pwd_icon.png' alt=""/>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" class="verCode-wrap">
              <el-input type="text" v-model="formLogin.code" placeholder="验证码">
                <template slot="prepend">验证码</template>
                <template slot="append">
                  <!--@click="getVerifyCode"-->
                  <img class="login-code"  :src="`${verCode.src}`"
                       style="width: 130px;">
                </template>
              </el-input>
            </el-form-item>

            <el-form-item class="remember-div">
              <el-checkbox v-model="remember">记住密码</el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button size="default" @click="submit" type="primary"
                         class="button-login">登录
              </el-button>
            </el-form-item>

            <el-form-item>
              <div
                class="page-login--options"
                flex="main:justify cross:center">
                <span @click="handleRegister">注册用户</span>
                <span><d2-icon name="question-circle"/> 忘记密码</span>
              </div>
            </el-form-item>

          </el-form>
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
    return {
      remember: true,
      vcUserName: '',
      dtCreateTime: '',
      noticeHtml: '',
      users: [
        {
          name: '管理员',
          username: 'admin',
          password: '123456'
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
        src: 'http://39.98.129.213:8081/getCode',
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
    handleRegister () {
      this.$router.push('/register')
    }

  }
}
</script>

<style lang="scss">
  $inputBgColor: #f5fafd;
  $inputBorderColor: #b6c5cc;
  .page-login {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
    padding-top: 18vh;
    height: 100%;
    background: #fff url('~@/assets/images/login_bg.jpg') no-repeat center center;
    background-size: cover;
    .login-title{
      color: #ffffff;
      font-size: 26px;
      line-height: 0;
      padding-left: 235px;
    }

    /*.page-login--content-main {*/
      .login-logo {
        height: 25px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        //padding-left: 20px;
        span {
          vertical-align: text-bottom;
          font-size: 16px;
          text-transform: uppercase;
          display: inline-block;
        }
        .logoLeft {
          width: 220px;
        }
        .logoRight {
          width: 180px;
        }
      /*}*/
    }

    .loginBox {
      display: flex;
      box-shadow: 0px 1px 40px -2px #496786;
      .loginBoxLeft {
        width: 235px;
        img {
          display: block;
          width: 100%;
        }
      }
      .loginBoxRight {
        background: #fff;
        width: 420px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .userLoginTitle {
      font-size: 18px;
      margin-bottom: 20px;
      color: #666;
      //font-weight: bold;
    }
    .loginInput {
      .el-input__inner {
        background-color: $inputBgColor;
        border: 1px solid $inputBorderColor;
        box-shadow: 0px 0px 10px 0px #dceffd inset;
        padding-left: 40px;
      }
    }
    .inputIcon {
      width: 16px;
      display: block;
      margin-right: 5px;
    }
    .el-input__prefix {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logoForm {
      width: 100%;
      padding: 40px 40px 0;
    }
    .button-login {
      width: 100%;
    }

    .el-input-group__append, .el-input-group__prepend {
      background-color: $inputBgColor;
      border: 1px solid $inputBorderColor;
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
          width: 126px;
          height: 38px;
          display: block;
          border-radius: 4px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
    .remember-div{
      text-align: right;
      margin: -20px 0 0 0 !important;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
      span{
        cursor: pointer;
      }
    }

  }
</style>
