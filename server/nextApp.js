const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const conf = require('../next.config.js');
// const { consola } = require('consola');
const dir = process.cwd();
const nextApp = next({ dev, conf, dir });
const nextAppHandle = nextApp.getRequestHandler();
const api = require('./api');
const Utils = require('./utils');
const Router = require('koa-router');

const TROLES = {
  /** 服务端 */
  ADMIN: 1,
  /** 用户端 */
  USER: 2,
};

const getUserInfo = async (ctx) => {
  return new Promise((resolve, reject) => {
    ctx.$axios.post(api.userURL.me).then((res) => resolve(res.data)).catch(reject);
  });
}
/**
 * 处理context
 * @param {*} ctx context
 * @param {*} routerURL 访问的路由
 * @param {*} role 角色
 * @param {*} redirectURL 重定向URL
 * @returns 
 */
const handleContext = async (ctx, routerURL, role, redirectURL) => {
  try {
    const data = await getUserInfo(ctx);
    if (data.roles instanceof Array && data.roles[0] === role) {
      return ctx.redirect(redirectURL);
    }
  } catch(e) {
    console.error(`Router ${routerURL} occur error: `, e);
  }
  await nextAppHandle(ctx.req, ctx.res);
};

const routerURL = {
  user: {
    home: '/home',
    licenseDetail: '/licenseDetail/:licenseId',
  },
  admin: {
    index: '/',
    sysLicenses: '/sysLicenses',
  },
  signin: '/signin',
  forbidden: '/403'
}

module.exports = async (app) => {
  await nextApp.prepare();
  const router = new Router();

  //=================== User ==========================

  router.get(routerURL.user.home,  async(ctx) => {
    return handleContext(ctx, routerURL.user.home, TROLES.ADMIN, routerURL.admin.index);
  });

    /** 用户端 - 证书详情 */
  router.get(routerURL.user.licenseDetail, async(ctx) => {
    return handleContext(ctx, routerURL.user.licenseDetail, TROLES.ADMIN, routerURL.forbidden);
  });

  //=================== Admin ==========================

  /** 管理端 - 主页 */
  router.get(routerURL.admin.index, async(ctx) => {
    return handleContext(ctx, routerURL.admin.index, TROLES.USER, routerURL.user.home);
  });

  /** 管理端 - 证书管理 */
  router.get(routerURL.admin.sysLicenses, async(ctx) => {
    return handleContext(ctx, routerURL.admin.sysLicenses, TROLES.USER, routerURL.forbidden);
  });

  router.all('(.*)', async (ctx) => {
      await nextAppHandle(ctx.req, ctx.res);
      ctx.respond = false
  })


  

  app.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  app.use(router.routes())
}
