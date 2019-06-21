/**
 * “权限管理”相关接口
 */
import request from '@/common/js/requests'

export default {
  /**
   * 添加权限
   * @param data
   */
  addPerm (data) {
    return request({
      url: '/sys_perm/add_perm',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data
    })
  },

  /**
   * 同步菜单权限数据
   * @param data
   */
  syncMenuPerms (permArr) {
    return request({
      url: '/sys_perm/sync/menu',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data: permArr
    })
  },
  /**
   * 同步接口权限数据
   * @param data
   */
  syncApiPerms (permArr) {
    return request({
      url: '/sys_perm/sync/api',
      method: 'post',
      decrypt: true,
      encrypt: true,
      data: permArr
    })
  },

  /**
   * 删除权限
   * @param data
   */
  deletePerm (data) {
    return request({
      url: '/sys_perm/del_perm',
      method: 'delete',
      decrypt: true,
      encrypt: true,
      data
    })
  },

  /**
   * 更新权限
   * @param data
   */
  updatePerm (data) {
    return request({
      url: '/sys_perm/update_perm',
      method: 'patch',
      decrypt: true,
      encrypt: true,
      data
    })
  },

  /**
   * 查询接口权限元数据
   * @param perm
   */
  listApiPermMetadata () {
    return request({
      url: '/sys_perm/meta/api',
      decrypt: true,
      method: 'get'
    })
  },

  /**
   * 列出所有菜单、按钮、接口等权限
   * @param perm
   */
  listAllPermissions () {
    return request({
      url: '/sys_perm/list/all',
      decrypt: true,
      method: 'get'
    })
  },

  /**
   * 列出按钮权限，按parent字段分组
   * @param perm
   */
  listBtnPermGroupByParent () {
    return request({
      url: '/sys_perm/list/btn_perm_map',
      decrypt: true,
      method: 'get'
    })
  }
}
