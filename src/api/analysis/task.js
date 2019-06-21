/**
 * “账号碰撞”相关接口
 */
import request from '@/common/js/requests'
import qs from 'qs'

export default {

  getTask (param) {
    return request({
      url: '/analysis/get',
      method: 'post',
      params: param
    })
  },
  uploadTask (data) {
    return request({
      url: '/analysis/add',
      method: 'post',
      data: data
    })
  },
  deleteTask (id) {
    return request({
      url: '/analysis/delete',
      method: 'delete',
      params: id
    })
  },
  rowWeight (param) {
    return request({
      url: '/analysis/removeduplicate',
      method: 'post',
      params: param
    })
  },
  searchResult (param) {
    return request({
      url: '/analysis/getresult',
      method: 'get',
      params: param
    })
  },
  conversionContent (param) {
    return request({
      url: '/analysis/conversionData',
      method: 'post',
      params: param
    })
  },
  getEventList (param) {
    return request({
      url: '/event/get',
      method: 'get',
      params: param
    })
  },
  uploadEvent (data) {
    return request({
      url: '/event/upload',
      method: 'post',
      data: data
    })
  }
}
