const utils = require('../utils');
const api = require('../api');

module.exports = (router) => {
  /**
   * @api {post} /pg/e1/signin 登录
   * @apiVersion 1.0.0
   * @apiName signin
   * @apiGroup 所有用户
   * @apiBody {String} username 用户名
   * @apiBody {String} password 密码
   * @apiPermission none
   * @apiSampleRequest /pg/e1/signin
   * @apiSuccess      {Number}    code  200
   * @apiSuccessExample {json} Success-Response:
   * {
   *   token: "e7b3d521eefa1ae1ef788d6bd446d9c0",
   *   expires: "2023-07-06T08:22:22.023Z"
   * }
   */
  router.post('/signin', async (ctx, next) => {
    try {
      const response = await ctx.$axios.post(api.authURL.login, ctx.request.body);
      if (response.data) {
        utils.setCookie(ctx, '_uname', ctx.request.body.username);
        utils.setCookie(ctx, 'sid', response.data.token);
        utils.setCookie(ctx, '_pid', null);
        ctx.body = response.data;
      }
      ctx.status = 200;
    } catch (e) {
      ctx.body = e.response.data;
      ctx.status = 500;
    }
  });
  /**
   * @api {post} /pg/e1/logout 退出登录
   * @apiVersion 1.0.0
   * @apiName logout
   * @apiGroup 所有用户
   * @apiSampleRequest /pg/e1/logout
   */
  router.post('/logout', async (ctx, next) => {
    try {
      const response = await ctx.$axios.post(api.authURL.logout);
      utils.handleLogoutCookies(ctx);
      if (response.data) {
        ctx.body = response.data;
      }
      ctx.status = 200;
    } catch (e) {
      utils.handleLogoutCookies(ctx);
      ctx.body = e.response.data;
      ctx.status = 500;
    }
  });

  /**
   * @api {post} /pg/e1/changePassword 修改密码
   * @apiVersion 1.0.0
   * @apiName changePassword
   * @apiGroup 所有用户
   * @apiBody {String} passwordOld 旧密码
   * @apiBody {String} passwordNew 新密码
   * @apiBody {String} passwordConfirm 确认密码
   * @apiSampleRequest /pg/e1/changePassword
   */
  router.post('/changePassword', async (ctx, next) => {
    try {
      const response = await ctx.$axios.post(api.userURL.changePassword, ctx.request.body);
      utils.handleLogoutCookies(ctx);
      if (response.data) {
        ctx.body = response.data;
      }
      ctx.status = 200;
    } catch (e) {
      ctx.body = e.response.data;
      ctx.status = 500;
    }
  });
}