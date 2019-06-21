import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/store'
// import { getToken } from '@/common/js/token'
import Code from '@/common/js/code'
import { Decrypt, Encrypt } from '@/common/js/cryptojs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 90 * 1000, // request timeout 90s
  responseType: JSON, // 返回数据类型定义为json
  withCredentials: true // 使前台能够保存cookie
})

// request interceptor 请求拦截
service.interceptors.request.use(config => {
  if (config.encrypt && config.data) {
    var datas = config.data;
    config.data = Encrypt(datas);
  }
  if (config.encrypt && config.params) {
    var paramss = config.params;
    config.params = Encrypt(paramss);
  }
  // if (store.getters.token) {
  // config.headers['casia-token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  config.headers = {
    'Content-Type': 'application/x-www-from-urlencoded', // 跨域设置
    'Access-Control-Allow-Origin': '*'
  }
  // }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.config.decrypt && response.data) {
      let datas = Decrypt(response.data)
      response.data = JSON.parse(datas)
    }
    if (response.data.code) {
      if (response.data.code === Code.SUCCESS) {

      } else if (response.data.code === Code.PASSWORD_ERROR || response.data.code === Code.LOCKED_ACCOUNT ||
        response.data.code === Code.EXCESSIVE_ATTEMPTS || response.data.code === Code.DISABLED_ACCOUNT || response.data.code === Code.IP_WHITE) {
        Message({ message: response.data.msg, type: 'warning', duration: 2000 })
      } else if (response.data.code === Code.UNKNOWN_ACCOUNT || response.data.code === Code.LOGIN_ERROR) {
        Message({ message: response.data.msg, type: 'error', duration: 1500 })
      } else if (response.data.code === Code.FAIL) {
        Message({ message: response.data.msg, type: 'error', duration: 1500 })
      } else if (response.data.code === Code.UNAUTHEN) {
        Message({ message: response.data.msg, type: 'warning', duration: 1000 })
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
        // 处理登录相关的错误
        // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
        //   store.dispatch('FedLogOut').then(() => { // 前端登出清空
        //     location.reload()// 为了重新实例化vue-router对象 避免bug
        //   })
        // }).catch(() => {
        //   store.dispatch('FedLogOut').then(() => { // 前端登出清空
        //     location.reload()// 为了重新实例化vue-router对象 避免bug
        //   })
        // })
      }
    }
    return response
  }, error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          Message({ message: '请求错误：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 401:
          Message({ message: '未授权：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 403:
          Message({ message: '拒绝访问：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 404:
          Message({ message: '请求API地址出错：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 405:
          Message({ message: 'HTTP请求方法出错：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 406:
          Message({ message: '无法生成响应实体：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 408:
          Message({ message: '请求超时：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 500:
          Message({ message: '服务器内部错误：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 501:
          Message({ message: '服务未实现：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 502:
          Message({ message: '网关错误：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 503:
          Message({ message: '服务不可用：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 504:
          Message({ message: '网关超时：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        case 505:
          Message({ message: 'HTTP版本不受支持：' + error.response.data.msg, type: 'error', duration: 5000 })
          break

        default: Message({ message: error.response.data.msg, type: 'error', duration: 5000 }); break
      }
    } else {
      Message({ message: '非法恶意请求：已被系统限制，请联系开发人员！', type: 'error', duration: 5000 })
    }
    // Message({ message: error.message, type: 'error', duration: 5000 })
    Promise.reject(error.message)
  }
)

export default service
