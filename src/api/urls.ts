// Auth
export const authURL = {
  login: () => {
    return `${location.protocol}//${location.host}/pg/e1/signin`;
  },
  logout: () => {
    return `${location.protocol}//${location.host}/pg/e1/logout`;
  },
};


// User
export const userURL = {
  changePassword: () => {
    return `${location.protocol}//${location.host}/pg/e1/changePassword`;
  },
  me: '/users/me',
};

// License
export const licenseURL = {
  /** 获取许可证详情 */
  get: '/license/get',
  /** 分发证书接口 */  
  assign: '/license/assign',
  /** 回收证书请求 */  
  recycle: '/license/recycle',
  /** 许可证列表 */  
  list: '/license/list',
  /** 用户许可证统计 */  
  overview: '/license/overview',
}

// sysUser
export const sysUserURL = {
  /** 用户列表 */
  list: '/admin/users/list',
  /** 用户列表信息总览 */
  overview: '/admin/users/overview',
  /** 添加用户 */
  create: '/admin/users/create',
  /** 编辑用户 */
  update: '/admin/users/update',
  /** 用户详情 */
  detail: '/admin/users/get',
  /** 删除用户 */
  delete: '/admin/users/delete',
};

// sysLicense
export const sysLicenseURL = {
  /** 用户许可证列表 */
  list: '/admin/license/list',
  /** 添加用户许可证 */
  create: '/admin/license/create',
  /** 编辑用户许可证 */
  update: '/admin/license/update',
  /** 用户许可证详情 */
  detail: '/admin/license/get',
  /** 删除用户许可证 */
  delete: '/admin/license/delete',
};

export default {};
