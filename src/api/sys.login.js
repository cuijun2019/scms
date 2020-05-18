import request from '@/plugin/axios'

// export function AccountLogin (data) {
//   return request({
//     url: '/login',
//     method: 'post',
//     data
//   })
// }
/**
 * 用户登录
 * @param data
 * @constructor
 */
export function AccountLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/**
 * 注销用户
 * @param data
 * @constructor
 */
export function AccountLogout (data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 * @param data
 * @constructor
 */
export function AccountRegister (data) {
  return request({
    url: '/agentInfo/register',
    method: 'post',
    data
  })
}

/**
 * 忘记密码-发送邮件
 * @param data
 * @constructor
 */
export function SendMail (data) {
  return request({
    url: '/mail',
    method: 'post',
    data
  })
}

/**
 * 忘记密码-验证码校验
 * @param data
 * @constructor
 */
export function CheckMailVerifyCode (data) {
  return request({
    url: '/mail/checkVerifyCode',
    method: 'post',
    data
  })
}

/**
 * 忘记密码-密码重置
 * @param data
 * @constructor
 */
export function UpdatePassword (data) {
  return request({
    url: '/mail/updatePassword',
    method: 'post',
    data
  })
}
