const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();

const access = {
  access: true
};


router.get('/letMeIn', async (ctx, next) => {
  ctx.body = access;
  await next();
});

app.use(router.routes());

module.exports = app;
