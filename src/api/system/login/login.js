/**
 * 登录相关接口
 */
import request from '@/common/js/requests'

export default {

  loginByUsername (username, password) {
    // 表单传值
    // var params = new URLSearchParams()
    // params.append('username', username)
    // params.append('password', password)
    const data = {
      username: username,
      password: password
    }
    // return request.post('/login/userlogin', data)
    return request({
      url: '/login/userlogin',
      method: 'post',
      decrypt: true, //解密
      encrypt: true, //加密
      data
    })
  },

  logout () {
    return request({
      url: '/login/userlogout',
      method: 'post'
    })
  },

  getUserInfo (token) {
    return request({
      url: '/sys_user/getUserInfo',
      method: 'get',
      decrypt: true,
      params: { token }
    })
  }

}
