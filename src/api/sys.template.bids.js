import request from '@/plugin/axios'

export function FetchBidsTemplate (method, data, edit = false) {
  let requestObj = {
    url: '/bidTemplate',
    method: method
  }
  if (edit) {
    requestObj.url = '/bidTemplate/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/bidTemplate/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.url = '/bidTemplate/' + data
        break
    }
  }
  return request(requestObj)
}
