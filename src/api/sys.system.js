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
 * 查询所有角色
 * @param id
 * @param role
 * @constructor
 */
export function FetchGetAllRoles () {
  return request({
    url: 'role/getAllRoles',
    method: 'get'
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
 * 通过角色id查询对应的所有用户
 * @param data
 * @constructor
 */
export function FetchUserByRoleId (data) {
  return request({
    url: '/user/getUserByRoleId/',
    method: 'post',
    data: data
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

/**
 * 获取每个菜单的按钮
 * @param id
 * @constructor
 */
export function FetchPermissionBtn (id) {
  return request({
    url: '/role/getThirdPermissionBySecondPermissionId/' + id,
    method: 'get'
  })
}

/**
 * 角色管理列表
 * @param method
 * @param data
 * @param edit
 * @constructor
 */
export function FetchRole (method, data, edit = false) {
  let requestObj = {
    url: '/role',
    method: method
  }
  if (edit) {
    requestObj.url = '/role/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/role/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.url = '/role/' + data
        break
    }
  }
  return request(requestObj)
}

/**
 * 编辑角色对应的权限
 * @param data
 * @constructor
 */
export function FetchUpdateRolePermissions (data) {
  return request({
    url: '/role/updateRolePermissions',
    method: 'post',
    data: data
  })
}

/**
 * 通过角色id查询角色拥有的权限
 * @param data
 * @constructor
 */
export function FetchRolePermission (roleId) {
  return request({
    url: '/role/getRolePermission/' + roleId,
    method: 'get'
  })
}
