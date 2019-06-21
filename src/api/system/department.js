/**
 * 单位处理相关接口
 */
import request from '@/common/js/requests'

export default {

  /**
   * 查询部门列表(分页)
   * @param perm
   */
  getDepartmentList (para) {
    return request({
      url: '/sys_department/list',
      method: 'get',
      decrypt: true,
      params: para
    })
  },
  /**
     * 删除部门
     * @param {*} para
     */
  delDepartment (para) {
    return request({
      url: '/sys_department/removeDepartment',
      method: 'delete',
      encrypt: true,
      data: para
    })
  },
  /**
     * 新增部门
     * @param {*} para
     */
  addDepartment (para) {
    return request({
      url: '/sys_department/addDepartment',
      method: 'post',
      encrypt: true,
      data: para
    })
  },
  /**
       * 编辑部门
       * @param {*} para
       */
  updateDepartment (para) {
    return request({
      url: '/sys_department/updateDepartment',
      method: 'post',
      encrypt: true,
      data: para
    })
  }
}
