import request from '@/plugin/axios'

export function FetchAgentInfo (method, data, edit = false) {
  let requestObj = {
    url: '/agentInfo',
    method: method
  }
  if (edit) {
    requestObj.url = '/agentInfo/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/agentInfo/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.method = 'put'
        requestObj.data = data
        break
    }
  }
  return request(requestObj)
}

/**
 *  代理商名称列表
 * @param data
 * @constructor
 */
export function FetchAgentsList (data) {
  return request({
    url: '/agentInfo/getAgentsList',
    method: 'get',
    params: data
  })
}

/**
 * 修改代理商状态
 * @param data
 * @constructor
 */
export function FetchUpdateAgent (data) {
  return request({
    url: '/agentInfo/updateAgent',
    method: 'post',
    data: data
  })
}

/**
 * 删除代理商接口
 * @param data
 * @constructor
 */
export function FetchDeleteAgents (data) {
  return request({
    url: '/agentInfo/deleteAgents',
    method: 'post',
    data: data
  })
}
