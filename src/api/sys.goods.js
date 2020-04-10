import request from '@/plugin/axios'

/**
 * 商品类目
 * @param data
 * @constructor
 */
export function FetchBrand (data) {
  return request({
    url: '/brandItem',
    method: 'get',
    params: data
  })
}

/**
 * 配件导入
 * @param data
 * @constructor
 */
export function PartInfoUpload (data) {
  return request({
    url: '/partInfo/upLoad',
    method: 'post',
    processData: false,
    contentType: false,
    data
  })
}

/**
 * 配件信息
 * @param method
 * @param data
 * @param edit
 * @constructor
 */
export function FetchPartInfo (method, data, edit = false) {
  let requestObj = {
    url: '/partInfo',
    method: method
  }
  if (edit) {
    requestObj.url = '/partInfo/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/partInfo/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.url = '/partInfo/' + data
        break
    }
  }
  return request(requestObj)
}

/**
 * 货物信息
 * @param method
 * @param data
 * @param edit
 * @constructor
 */
export function FetchCargoInfo (method, data, edit = false) {
  let requestObj = {
    url: '/cargoInfo',
    method: method
  }
  if (edit) {
    requestObj.url = '/cargoInfo/' + data
  } else {
    switch (method) {
      case 'get':
        requestObj.params = data
        break
      case 'post':
        requestObj.data = data
        break
      case 'put':
        requestObj.url = '/cargoInfo/' + data.id
        requestObj.data = data
        break
      case 'delete':
        requestObj.url = '/cargoInfo/' + data
        break
    }
  }
  return request(requestObj)
}

/**
 * 下载货物导入模板
 * @param data
 * @constructor
 */
export function FetchDownloadTemplate (data) {
  return request({
    url: '/cargoInfo/export',
    method: 'get',
    params: data
  })
}
