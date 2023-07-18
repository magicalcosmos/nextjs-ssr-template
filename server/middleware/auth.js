// const { consola } = require('consola');
const api = require('../api');
const utils = require('../utils');
module.exports = () => {
  return async (ctx, next) => {
    try {
      if (ctx.url.indexOf('.') === -1) {
        if (ctx.url.indexOf('/signin') !== -1) { // 登录页
          if (utils.getCookie(ctx, 'sid')) { // 有sid跳回首页
            return ctx.redirect('/');
          } else {
            utils.setCookie(ctx, '_pid', Date.now());
          }
        } else { // 非登录页
          if (!utils.getCookie(ctx, 'sid')) { // 没有sid跳回登录
            utils.setCookie(ctx, '_pid', Date.now());
            return ctx.redirect('/signin');
          } else {
            const resp = await ctx.$axios.post(api.userURL.me);
            ctx.res.userInfo = resp.data;
          }
        }
      } else if (utils.getCookie(ctx, 'sid') && !ctx.res.userInfo) {
        // const resp = await ctx.$axios.post(api.userURL.me);
        // ctx.res.userInfo = resp.data;       
      }
    } catch(e) {
      console.error('auth occur error: ', e);
      utils.handleLogoutCookies(ctx);
      return ctx.redirect('/signin');
    }
    await next();
  }
}
