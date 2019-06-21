/**
 * “角色管理”相关接口
 */
import request from '@/common/js/requests'

export default {
  /**
   * 查询角色
   * @param para
   */
  getRoleList (para) {
    return request({
      url: '/sys_role/list',
      method: 'get',
      decrypt: true,
      params: para
    })
  },
  /**
  * 查询级别
  */
  getGrades () {
    return request({
      url: '/sys_role/gardes',
      method: 'get',
      decrypt: true,
      data: {
      }
    })
  },
  /**
  * 根据级别查询角色
  */
  getRolesByGrade (para) {
    return request({
      url: '/sys_role/getRolesByGrade',
      method: 'get',
      decrypt: true,
      params: para
    })
  },
  /**
   * 添加角色
   * @param data
   */
  addRole (data) {
    return request({
      url: '/sys_role/addRole',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data
    })
  },

  /**
   * 删除角色
   * @param para
   */
  deleteRole (para) {
    return request({
      url: '/sys_role/delRole',
      method: 'delete',
      encrypt: true,
      data: para
    })
  },

  /**
   * 更新角色
   * @param data
   */
  updateRole (data) {
    return request({
      url: '/sys_role/updateRole',
      method: 'patch',
      encrypt: true,
      data
    })
  },
  /**
   * 查选角色的所有权限值
   * @param para
   */
  findRolePerms (para) {
    return request({
      url: '/sys_role/role_perms',
      method: 'get',
      decrypt: true,
      params: para
    })
  },
  /**
   * 更新角色的权限
   * @param perm
   */
  updateRolePerms (data) {
    return request({
      url: '/sys_role/updateRolePerms',
      method: 'patch',
      decrypt: true,
      encrypt: true,
      data: data
    })
  },

  /**
   * 添加角色的权限
   * @param perm
   */
  addRolePerm (data) {
    return request({
      url: '/sys_role/add_Roleperm',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data
    })
  },
  /**
   * 删除角色的权限
   * @param data
   */
  deleteRolePerm (data) {
    return request({
      url: '/sys_role/del_Roleperm',
      method: 'delete',
      decrypt: true,
      encrypt: true,
      data
    })
  },
  /**
   * 查询自定义权限
   * @param data
   */
  searchCustomPerm (data) {
    return request({
      url: '/sys_role/searchCustomPerm',
      method: 'get',
      decrypt: true,
      params: data
    })
  },
  /**
   * 开启关闭自定义权限
   * @param perm
   */
  openCustomPerm (data) {
    return request({
      url: '/sys_role/openCustomPerm',
      decrypt: true,
      encrypt: true,
      method: 'post',
      data
    })
  },
  /**
   * 更新自定义权限
   * @param perm
   */
  updateCustomPerm (data) {
    return request({
      url: '/sys_role/updateCustomPerm',
      decrypt: true,
      encrypt: true,
      method: 'post',
      data
    })
  }
}
