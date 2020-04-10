import request from '@/plugin/axios'

/**
 * 用户管理列表
 * @param method
 * @param data
 * @param edit
 * @constructor
 */
export function FetchUser (method, data, edit = false) {
  let requestObj = {
    url: '/user',
    method: method
  }
  if (edit) {
    requestObj.url = '/user/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/user/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.url = '/user/' + data
        break
    }
  }
  return request(requestObj)
}

/**
 * 修改用户
 * @param data
 * @constructor
 */
export function FetchUpdateUser (data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: data
  })
}

/**
 * 修改用户角色
 * @param id
 * @param role
 * @constructor
 */
export function FetchChangeUserRole (id, role) {
  return request({
    url: '/user/changeUserRole/' + id + '/' + role,
    method: 'get'
  })
}

/**
 * 查询所有菜单
 * @param data
 * @constructor
 */
export function FetchAllPermission (data) {
  return request({
    url: '/role/getAllPermission',
    method: 'get',
    params: data
  })
}
