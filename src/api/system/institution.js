/**
 * 单位处理相关接口
 */
import request from '@/common/js/requests'

export default {
  /**
   * 查询单位列表
   * @param para
   */
  getInstListById (para) {
    return request({
      url: '/sys_institution/id/list',
      method: 'get',
      decrypt: true,
      params: para
    })
  },
  /**
 * 查询单位列表(分页)
 * @param perm
 */
  getInstitutionList (para) {
    return request({
      url: '/sys_institution/list',
      method: 'get',
      decrypt: true,
      params: para
    })
  },
  /**
   * 删除单位
   * @param {*} para
   */
  delInstituton (para) {
    return request({
      url: '/sys_institution/removeInstition',
      method: 'delete',
      encrypt: true,
      data: para
    })
  },
  /**
   * 新增单位
   * @param {*} para
   */
  addInstitution (para) {
    return request({
      url: '/sys_institution/addInstitution',
      method: 'post',
      encrypt: true,
      data: para
    })
  },
  /**
     * 编辑单位
     * @param {*} para
     */
  updateIntitution (para) {
    return request({
      url: '/sys_institution/updateIntitution',
      method: 'post',
      encrypt: true,
      data: para
    })
  },
  /**
 * 根据用户权限获取所见单位部门列表
 * @param perm
 */
  searchInstDepsByUser () {
    return request({
      url: '/sys_institution/searchUserIntis',
      decrypt: true,
      method: 'get'
    })
  },
  /**
 * 根据用户权限获取所见单位部门用户列表
 * @param perm
 */
  searchInstDepUsersByUser () {
    return request({
      url: '/sys_institution/searchUserIntisDeps',
      decrypt: true,
      method: 'get'
    })
  }
}
