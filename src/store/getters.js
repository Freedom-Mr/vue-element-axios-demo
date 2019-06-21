// 全局参数
const getters = {
  sidebar: state => state.app.sidebar, // 侧边栏
  device: state => state.app.device,
  language: state => state.app.language, // 语种
  themeColor: state => state.app.themeColor, // 主题颜色
  visitedViews: state => state.tagsView.visitedViews, // 选中显示
  cachedViews: state => state.tagsView.cachedViews, // 缓存显示
  token: state => state.user.token, // 用户认证标识
  user_id: state => state.user.user_id, // 用户ID
  account: state => state.user.account, // 用户账号
  realName: state => state.user.realName, // 用户姓名
  profile_photo: state => state.user.profile_photo, // 用户头像路径
  email: state => state.user.email, // 用户邮箱
  telephone: state => state.user.telephone,
  status: state => state.user.status, // 用户状态
  inst_id: state => state.user.inst_id, // 用户单位
  dep_id: state => state.user.dep_id, // 用户部门
  part: state => state.user.part, // 用户等级角色
  roles: state => state.user.roles, // 用户权限角色
  perms: state => state.user.perms, // 用户权限
  visitor: state => state.user.visitor, // 用户是否为游客
  setting: state => state.user.setting, // 用户设置
  permission_routers: state => state.permission.routers, // 权限路由
  addRouters: state => state.permission.addRouters, // 权限新增路由
  errorLogs: state => state.errorLog.logs, // 错误日志
  isLock: state => state.user.isLock, // 锁屏状态
  lockPasswd: state => state.user.lockPasswd // 锁屏密码
}
export default getters
