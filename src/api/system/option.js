/**
 * “选项”相关接口
 */
import request from '@/common/js/requests'

export default {

  listRoleOptions () {
    return request({
      url: '/option/role',
      method: 'get'
    })
  }

}
