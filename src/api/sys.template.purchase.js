import request from '@/plugin/axios'

export function FetchResultTemplate (method, data, edit = false) {
  let requestObj = {
    url: '/resultTemplate',
    method: method
  }
  if (edit) {
    requestObj.url = '/resultTemplate/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/resultTemplate/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.url = '/resultTemplate/' + data
        break
    }
  }
  return request(requestObj)
}
