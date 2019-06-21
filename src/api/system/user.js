/**
 * “用户管理”相关接口
 */
import request from '@/common/js/requests'

export default {

  queryUser (queryParam, pageParam) {
    return request({
      url: '/sys_user/query',
      method: 'post',
      data: {
        ...queryParam,
        current: pageParam.current,
        size: pageParam.size
      }
    })
  },
  getUserInfo () {
    return request({
      url: '/sys_user/getUserInfo',
      decrypt: true,
      method: 'get'
    })
  },
  getUsers (data) {
    return request({
      url: '/sys_user/getUsers',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data: data
    })
  },
  deleteUser (data) {
    return request({
      url: '/sys_user/deleteUser',
      method: 'delete',
      encrypt: true,
      data: data
    })
  },
  addUser (data) {
    return request({
      url: '/sys_user/addUser',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data: data
    })
  },
  /**
   * 更新用户的角色
   * @param perm
   */
  updateUserRole (para) {
    return request({
      url: '/sys_user/updateUserRole',
      method: 'patch',
      encrypt: true,
      data: para
    })
  },
  uploadImage (data) {
    return request({
      url: '/sys_user/uploadImage',
      method: 'post',
      encrypt: true,
      data: data
    })
  },
  delImage (data) {
    return request({
      url: '/sys_user/deleteImage',
      method: 'delete',
      data: data
    })
  },
  getUserPwd (data) {
    return request({
      url: '/sys_user/userGP',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data
    })
  },
  updatePwd (data) {
    return request({
      url: '/sys_user/userUP',
      method: 'patch',
      encrypt: true,
      data
    })
  },
  updateUser (data) {
    return request({
      url: '/sys_user/updateUser',
      method: 'patch',
      encrypt: true,
      data
    })
  },
  isUserName (data) {
    return request({
      url: '/sys_user/isUserName',
      method: 'get',
      params: data
    })
  },
  uppd (data) {
    return request({
      url: '/sys_user/uppd',
      method: 'patch',
      decrypt: true,
      encrypt: true,
      data
    })
  },
  loginIpList (perm) {
    return request({
      url: '/sys_user/userIP/list',
      method: 'get',
      params: perm
    })
  },
  loginIpGroup (perm) {
    return request({
      url: '/sys_user/userIP/group',
      method: 'get',
      decrypt: true,
      params: perm
    })
  },
  getIpLise (perm) {
    return request({
      url: '/sys_user/white/list',
      method: 'post',
      decrypt: true,
      params: perm
    })
  },
  updateMe (perm) {
    return request({
      url: '/sys_user/updateMe',
      method: 'patch',
      params: perm
    })
  }
}
