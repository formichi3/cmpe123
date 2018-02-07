// require packages
const Koa = require('koa');
const router = require('koa-router')();
const mount = require('koa-mount');
const bodyParser = require('koa-body-parser');

// create an instance of the Koa object
const app = new Koa();
// mount the route

app.use(mount(require('./router/letMeIn.js')));
app.use(mount(require('./router/lock.js')));
app.use(mount(require('./router/user.js')));

app.use(bodyParser());

app.use(router.routes()); // route middleware
if(require.main === module) {
     app.listen(3000); // default
}
