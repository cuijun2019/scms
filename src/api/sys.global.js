import request from '@/plugin/axios'

/**
 * 文件上传
 * @param data
 * @constructor
 */
export function Upload (data) {
  return request({
    url: '/upload',
    method: 'post',
    processData: false,
    contentType: false,
    data
  })
}

/**
 * 文件下载
 * @param id
 * @constructor
 */

export function Download (id) {
  return request({
    url: '/download/' + id,
    method: 'get'
  })
}
