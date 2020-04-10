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
        requestObj.url = '/agentInfo/' + data
        break
    }
  }
  return request(requestObj)
}

/**
 * 导出代理商
 * @param method
 * @param data
 * @constructor
 */
export function AgentInfoExport (method, data) {
  return request({
    url: '/agentInfo/export',
    method: method,
    params: data,
    responseType: 'blob'
   // responseType: 'arraybuffer' // 二进制流
  })
}
