/**
 * login
 */
export const LOGIN = {
  /** 用户名 */
  USERNAME: 'username',
  /** 密码 */
  PASSWORD: 'password',
  /** 会话ID */
  SESSIONID: 'SESSIONID',
  /** token */
  TOKEN: 'sha-beer-token', 
  /** 语言 */
  LANG: 'rocket-lang' 
} as const;

export type TLOGIN = typeof LOGIN[keyof typeof LOGIN];

/**
 * license status
 */
export const LICENSE_STATUS = {
  /** 未创建 */
  NOT_CREATE: 0,
  /** 使用中 */
  IN_USE: 1,
  /** 已过期 */
  EXPIRED: 2,
} as const;
export type TLicenseStatus = typeof LICENSE_STATUS[keyof typeof LICENSE_STATUS];

/**
 * user type
 */
export const USER_TYPE = {
  /** 正式交付用户 */
  PAID: 1,
  /** 试用 */
  APPROVAL: 2,
  /** 控安内部 */
  INTERNAL: 3,
  /** 管理员 */
  ADMIN: 0,
} as const;
export type TUserType = typeof USER_TYPE[keyof typeof USER_TYPE];

/**
 * user role
 */
export const USER_ROLE = {
  /** 管理员 */
  ADMIN: 1,
  /** 其他 */
  REGULAR: 2,
} as const;
export type TUserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

/**
 * 客户端license状态
 */
export const CLIENT_LICENSE_STATUS = {
  /** 待分发 */
  TO_BE_DISTRIBUTED: 1,
  /** 已分发 */
  DISTRIBUTED: 2,
  /** 已过期 */
  expired: 3,
} as const;
export type TLicenseUsageStatus = typeof CLIENT_LICENSE_STATUS[keyof typeof CLIENT_LICENSE_STATUS];

/**
 * version type
 */
export const VERSION_TYPE = {
  /** 正式版 */
  OFFICIAL: 1,
  /** 试用版 */
  TRIAL: 2,
} as const;
export type TVersionType = typeof VERSION_TYPE[keyof typeof VERSION_TYPE];

/**
 * data collection
 */
export const DATA_COLLECTION = {
  /** 不收集 */
  NONE: 0,
  /** 正式服务器 */
  OFFICIAL: 1,
  /** 试用服务器 */
  TRIAL: 2,
} as const;
export type TDataCollection = typeof DATA_COLLECTION[keyof typeof DATA_COLLECTION];

/**
 * 功能模块
 */
export const MODULES = {
  /** 单元 */
  UNIT: "unit-test",
  /** 静态 */
  STATIC: "static-check",
  /** 集成 */
  INTEGRATE: "integration-test",
} as const;
export type TModules = typeof MODULES[keyof typeof MODULES];

/**
 * 错误码
 */
export const ERROR_CODE = {
  /** 参数错误 */
  MIN_STRING_LENGTH: '03001',

  /** 未授权 */
  UNAUTHENTICATED: '04001',
  /** 没有权限 */
  FORBIDDEN: '04002',
  /** 用户不存在 */
  USER_NOT_EXIST: '04003',
  /** 登录时，密码错误 */
  LOGIN_USER_PASSWORD_NOT_MATCH: "04004",
  /** 修改密码时，新旧密码一样 */
  CHANGE_OLD_NEW_PASSWORD_SAME: "04005",
  /** 修改密码时，新密码和确认密码不一致 */
  CHANGE_OLD_NEW_PASSWORD_DIFF: "04006",
  /** 用户名已存在 */
  USER_EXISTED: "04007",
  /** 修改用户信息时，未改变任何字段 */
  NO_FILED_CHANGE: "04008",
  /** 修改密码时，旧密码错误 */
  CHANGE_USER_OLD_NEW_PASSWORD_NOT_MATCH: "04009",

  /** 许可证不存在 */
  LICENSE_NOT_EXIST: "05001",
  /** 许可证重名 */
  LICENSE_DUPLICATE: "05002",
  /** 已分发的许可证不允许编辑 */
  LICENSE_ASSIGNED_NO_EDIT: "05003",
  /** 许可证不属于当前用户 */
  LICENSE_NOT_BELONG_CURRENT_USER: "05004",
  /** 许可证颁发当前状态异常 */
  LICENSE_ASSIGN_EXCEPTION: "05005",
  /** 许可证回收当前状态异常 */
  LICENSE_RECYCLE_EXCEPTION: "05006",
  /** 许可证颁发失败 */
  LICENSE_ASSIGN_FAILED: "05007",
  /** 许可证回收失败 */
  LICENSE_RECYCLE_FAILED: "05008",
  /** 缺少许可证密钥 */
  LICENSE_NO_KEY_CHAIN: "05009",
  /** 网络错误 */
  NETWORK_ERROR: 'ECONNREFUSED',



} as const;

export type TERRORCODE = typeof ERROR_CODE[keyof typeof ERROR_CODE];
