import Vue from 'vue'
import Router from 'vue-router'
import Error404 from '@/components/errorpage/404'
import Error401 from '@/components/errorpage/401'
import Error402 from '@/components/errorpage/402'
import SvgAll from '@/components/svg-all/svg-all'
/* Layout */
import Layout from '@/components/layout/Layout'
const _import = require('./_import_production')
// const _import = require('./_import_development')
// const _import = file => require('@/views/' + file + '.vue').default
Vue.use(Router)

/**
 * 路由说明: 当路由有子集时，它会自动成为嵌套模式
 **/
/**
 * hidden: true                   侧边栏是否显示改路由（404页面/登陆页面 等不需要显示）
 * alwaysShow: true               如果设置为true，将始终显示根菜单，不管它的子路由长度是多少。
 *                                如果没有固定的路线，在子集的下面只有一条路。
 *                                它将变为嵌套模式，false则不会显示根菜单。
 * redirect: noredirect           如果“redirect:noredirect”将不会在breadcrumb中重定向。
 * name:'router-name'             <keep-alive>使用这个路由名字(必须设置!!!) 同时必须为英文
 * meta : {                       *************必须设置一下****************
    title: 'title'               显示的span标签的内容 对应 @utils/u18n 中的国际化title 需要@lang/zh 和 en  中包含才可以  会在左侧列表和面包屑中显示 (recommend set)
    icon: 'svg-name'             svg的class类名 需要在@icons/svg中有对应的svg才可以 会在左侧列表中显示
    noCache: true                如果fasle，页面将不会被缓存(默认为false)
    title: 'documentation', // 标题
    icon: 'chuangxin', // 图标
    level: 1, // 权限级别
    fid: '', // 父级权限id 一级和二级权限无fid（因为一级权限无id）
    s: 'event', // 系统权限标识
    id: ''// 当前权限id 一级权限无id
  }
 **/
export const constantRouterMap = [
  /******************************     公共       **********************************/
  { path: '/login', name: 'login', component: _import('_system/login/index'), hidden: false },
  { path: '/authredirect', component: _import('_system/login/authredirect'), hidden: true },
  { path: '/page401', component: Error401, hidden: true },
  { path: '/page402', component: Error402, hidden: true },
  { path: '/page404', component: Error404, hidden: true },
  { path: '/lock', name: 'lock', component: _import('_system/login/lock'), hidden: true },// 锁屏
  { path: '/svg', component: SvgAll },

  /******************************     大屏       **********************************/
  { path: '/dataAssets', component: _import('bigScreen/dataAssets'), hidden: true },
  { path: '/hotTopic', component: _import('bigScreen/hotTopic'), hidden: true },
  { path: '/eventOverview', component: _import('bigScreen/eventOverview'), hidden: true },
  { path: '/warningInfo', component: _import('bigScreen/warningInfo'), hidden: true },

  /******************************     首页       **********************************/
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: _import('home/index'),
      name: 'home',
      meta: { title: '首页', icon: '首页', noCache: true }
    }]
  }

]

// 路由实例
export default new Router({
  base: __dirname,
  scrollBehavior: () => ({ y: 0 }), // 滚动位置
  routes: constantRouterMap // 路由集合
})
export const asyncRouterMap = [

  {
    // 专题分析
    path: '/event',
    component: Layout,
    meta: { perm: 'm:event', title: '专题分析', icon: '知识图谱' },
    children: [
      {
        path: 'event_list',
        name: 'event_list',
        component: _import('event/menu_1/index'),
        meta: { perm: 'm:event:list', title: '专题列表', icon: '专题分析' }
      },
      {
        path: 'event_config',
        name: 'event_config',
        component: _import('event/menu_2/index'),
        meta: { perm: 'm:event:config', title: '专题配置', icon: '节点管理' }
      },
    ]
  },
  {
    // 系统管理，不能删除
    path: '/system',
    component: Layout,
    meta: { perm: 'm:sys', title: '系统管理', icon: '系统管理' },
    children: [

      {
        path: 'details_manage',
        name: 'details_manage',
        component: _import('_system/userDetails/index'),
        meta: { perm: 'm:sys:userDetails', title: '用户详情', icon: '用户资料', noCache: true }
      },
      {
        path: 'pwd_manage',
        name: 'pwd_manage',
        component: _import('_system/changePWD/index'),
        meta: { perm: 'm:sys:changePWD', title: '修改密码', icon: '密码修改', noCache: true }
      },
      {
        path: 'user_manage',
        name: 'user_manage',
        component: _import('_system/user/index'),
        meta: { perm: 'm:sys:user', title: '用户管理', icon: '用户管理', noCache: true }
      },
      {
        path: 'department_manage',
        name: 'department_manage',
        component: _import('_system/department/index'),
        meta: { perm: 'm:sys:department', title: '部门管理', icon: '部门管理', noCache: true }
      },
      {
        path: 'institution_manage',
        name: 'institution_manage',
        sys: true,
        component: _import('_system/institution/index'),
        meta: { perm: 'm:sys:institution', title: '单位管理', icon: '单位管理', noCache: true }
      },
      {
        hidden: true,
        path: 'custom_manage/:type/custom_perm',
        name: 'custom_manage_custom_perm',
        component: _import('_system/perm/custom_perm'),
        meta: { perm: 'm:sys:custom_perm', hiddenTag: true, title: '自定义权限' }
      },
      {
        path: 'role_manage',
        name: 'role_manage',
        sys: true,
        component: _import('_system/roleGrade/index'),
        meta: { perm: 'm:sys:role', title: '角色管理', icon: '五角星', noCache: true }
      },
      {
        hidden: true,
        path: 'role_manage/role_perm',
        name: 'role_manage_role_perm',
        sys: true,
        component: _import('_system/roleGrade/role_perm'),
        meta: { perm: 'm:sys:role_perm', hiddenTag: true, title: '角色授权' }
      },
      {
        path: 'perm_manage',
        name: 'perm_manage',
        sys: true,
        component: _import('_system/perm/index'),
        meta: { perm: 'm:sys:perm', title: '权限管理', icon: '权限管理', noCache: true }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
