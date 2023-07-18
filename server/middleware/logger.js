const bodyParser = require('koa-bodyparser');
// const consola = require('consola');
module.exports = () => {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    const responseTime = (Date.now() - start).toString();
    console.log(`${ctx.url}响应时间为：${responseTime / 1000}s`);
  };
};