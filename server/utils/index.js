
class Utils {
  setCookie(ctx, key, value) {
    ctx.cookies.set(key,  value, {
      maxAge: 2147483647, // cookie有效时长
      expires: new Date('2123-06-21'),  // cookie失效时间
      httpOnly: false,  // 是否只用于http请求中获取
      overwrite: false  // 是否允许重写
    });
  }
  getCookie(ctx, key) {
    return ctx.cookies.get(key);
  }

  /**
   * 退出登录时重置cookies
   * @param {*} ctx 
   */
  handleLogoutCookies(ctx) {
    this.setCookie(ctx, '_uname', null);
    this.setCookie(ctx, 'sid', null);
    this.setCookie(ctx, '_pid', Date.now());
  }
}

const utils = new Utils();

exports = module.exports = utils;