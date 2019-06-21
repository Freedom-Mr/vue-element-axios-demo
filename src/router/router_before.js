import Router from '@/router'
import store from '@/store/store'
// import permission from '@/router/per_mun'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/common/js/token' // getToken from cookie
// import code from '@/common/js/code.js'
import { validateNull } from '@/common/js/validate.js'
NProgress.configure({ showSpinner: false })// NProgress Configuration

/**
 * 匹配权限
 * @param userPerms 用户拥有的权限集合，后台返回来，存在vuex，数据类型是数组
 * @param routerPerm 定义的src/router/permission.js的路由表asyncRouterMap中
 * @returns {*}
 */
function hasPermission (userPerms, routerPerm) {
  // 特殊值，*代表所有资源权限
  if (userPerms.some(p => p.val === '*')) return true
  // 如果菜单路由上没有声明perm属性，默认显示该菜单，代表所有人可以访问
  if (!routerPerm) return true
  // 判断用户的资源权限集合中是否包含该菜单路由声明的资源权限
  return userPerms.some(p => p.val === routerPerm)
}

const loginRoute = '/login' // 登录路径
const page404 = '/page404' //404
const lockRoute = '/lock' // 锁屏路径
const whiteList = new Set([loginRoute, '/authredirect', '/svg', '/page401', page404])// 路径白名单

// 开始导航守卫
Router.beforeEach((to, from, next) => {
  NProgress.start()
  let token = getToken()
  if (!validateNull(token)) {
    // 1.有token
    if (!store.getters.isLock) {
      // 1.1未锁屏
      if (to.path === loginRoute) {
        // 1.1.1 如果是去登录页，有token视为已登录，直接跳到首页
        next({ path: '/' })
      } else {
        // 1.1.2 如果不是去登录页，判断是否有访问权限
        if (store.getters.visitor) {
          // 1.1.2.1 若该标记为true,是因为GetUserInfo返回结果发现用户信息中roles或perms为空数组，即未配置任何角色或权限，
          // 所以视为游客visitor给放行，放行后游客只能看到公共可以访问的菜单(即src/router/index.js中没有配置perm属性的路由)。
          whiteList.has(to.path) ? next() : next(page404)
        } else if (!store.getters.perms || store.getters.perms.length === 0) {
          // 1.1.2.2 检查发现不是游客且未加载用户权限信息，应该调用接口加载用户权限信息
          // 用户刷新页面会导致vuex状态清空，或者用户首次登录，vuex中还没有权限信息。都要调用后台接口获得用户信息
          store.dispatch('GetUserInfo').then(res => {
            const perms = res.data.data.perms // note: roles must be a array! such as: [{name:'菜单1',val:'menu:1'}]
            store.dispatch('GenerateRoutes', { perms }).then(() => { // 根据roles权限生成可访问的路由表
              Router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          }).catch((err) => {
            store.dispatch('FedLogOut').then(() => {
              Router.error(err || '获取用户信息失败，请重试')
              next({ path: '/' })
            })
          })
        } else {
          // 1.2.3 如果vuex种有权限信息，匹配权限信息，匹配ok则放行
          if (hasPermission(store.getters.perms, to.meta.perm)) {
            next()
          } else {
            next({ path: '/page404', replace: true, query: { noGoBack: true } })
          }
        }
      }
    } else {
      // 1.2 已锁屏 进入锁屏页面，如果进入请求路径为锁屏路径时放行，否则重定向到锁屏页面
      if (to.path !== lockRoute) {
        next({ path: '/lock' })
      } else {
        next()
      }
    }
  } else {
    // 2.没有token
    // 如果要访问的路由在白名单中，直接进入；否则，重定向到登录页面
    whiteList.has(to.path) ? next() : next(loginRoute);
  }
  NProgress.done()
})

// 结束导航守卫
Router.afterEach(() => {
  NProgress.done() // finish progress bar
})
