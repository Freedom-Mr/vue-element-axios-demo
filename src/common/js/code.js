const Code = {

  /** 请求成功 */
  SUCCESS: 7200,

  /** 请求失败 */
  FAIL: 7100,

  /** 未登录 */
  UNAUTHEN: 7777,

  /** 未知账户 */
  UNKNOWN_ACCOUNT: 7300,

  /** 密码错误 */
  PASSWORD_ERROR: 7301,

  /** 账号过期或锁定 */
  LOCKED_ACCOUNT: 7302,

  /** 账户登录错误次数达上限 */
  EXCESSIVE_ATTEMPTS: 7303,

  /** 帐号已经禁止登录 */
  DISABLED_ACCOUNT: 7304,

  /** 账户验证未通过 */
  LOGIN_ERROR: 7305,

  /** 账户IP白名单未通过 */
  IP_WHITE: 7306,

  /** 参数不能为空 */
  NOT_EMPTY: 7400,

  /** 登录错误 */
  MISSING_PARAMETER: 7401,

  /** 权限不足 */
  UNAUTHORIZED: 7402,

  /** 参数解析失败 */
  MESSAGE_NOT_READABLE: 7403,

  /** 参数验证失败 */
  PARAMETER_VALIDATION_FAILED: 7404,

  /** 参数绑定失败 */
  PARAMETER_BIND_FAILED: 7405,

  /** 不支持当前请求方法 */
  METHOD_NOT_ALLOWED: 7406,

  /** 不支持当前媒体类型 */
  UNSUPPORTED_MEDIA_TYPE: 7407,

  /** 业务逻辑异常 */
  INTERNAL_SERVER_ERROR: 7500,

  /** 操作数据库出现异常 */
  INTERNAL_Db_ERROR: 7501,

  /** 通用异常 */
  UNKNOWN_ERROR: 7600
}
export default Code
