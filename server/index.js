const Koa = require('koa');
// const consola = require('consola');
const createNextAppRoutes = require('./nextApp');
const proxy = require('./middleware/proxy');
const Router = require('koa-router');
const Routes = require('./router');
const bodyParser = require('koa-bodyparser');
const Axios = require('./middleware/axios');
const Auth = require('./middleware/auth');
const KoaStatic = require('koa-static');


async function start() {
  try {
    const server = new Koa();

    server.use(KoaStatic(__dirname + '/api-docs'));

    server.use(Axios());
    
    // 授权
    server.use(Auth());

    // 以/pg/e1开头的都是接口类型
    const router = new Router({
      prefix: '/pg/e1'
    });
    await Routes(router);

    server
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

    // Next render routes
    await createNextAppRoutes(server);

    const host = process.env.HOST || '0.0.0.0';
    const port = process.env.PORT || 3389;

    server.listen(port, host);
    console.info(`Server listening on http://${host}:${port}`);

    server.on('error', (err, ctx) => {
      console.error('server error', err, ctx);
    });
  } catch (err) {
    console.error(err);
  }
}

start();
