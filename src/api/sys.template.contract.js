import request from '@/plugin/axios'

export function FetchContractTemplate (method, data, edit = false) {
  let requestObj = {
    url: '/contractTemplate',
    method: method
  }
  if (edit) {
    requestObj.url = '/contractTemplate/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/contractTemplate/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.url = '/contractTemplate/' + data
        break
    }
  }
  return request(requestObj)
}
