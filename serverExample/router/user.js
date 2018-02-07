const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const app = new Koa();
app.use(bodyParser());
const _ = require('underscore')



//temp user 'database'. this will be replaced by queries to google cloud datastore buckets
const db = {
  users: [
    {
      type: 'user',
      id: 1
    }, {
      type: 'user',
      id: 2
    },
    {
      type: 'user',
      id: 3
    }
  ]
}

//get all users
router.get('/users/', async (ctx, next) => {
  ctx.body = db.users;
  await next();
});

//get a specific user
router.get('/users/:id', async (ctx, next) => {
  const id = ctx.params.id;
  var result = userSearch(id);
  if (!result){
    ctx.body = {
      error: "no such user"
    }
  }
  else {
    ctx.body = result;
  }
  await next();
});

//create new user
router.post('/users/:id', async (ctx, next) => {
  const id = parseInt(ctx.params.id);
  const user = userSearch(id);
  if (!user){
    const newuser = {
      type: 'user',
      id: id
    }
    db.users.push(newuser)
    ctx.body = {
      result: "success",
      userIdAdded: id
    }
  }
  else {
    ctx.body = {
      result: "error",
      msg: "user already exists"
    }
  }
  await next();
});

router.delete('/users/:id', async (ctx, next) => {
  const id = parseInt(ctx.params.id);
  const userExists = userSearch(id);
  if (userExists){
    ctx.body = {
      result: "success",
      userIdRemoved: id
    }
  }
  else {
    ctx.body = {
      result: "error",
      msg: "user did not exist"
    }
  }
  await next();
});

//returns user if exists, null if not
function userSearch(userId) {
  var result = _.find(db.users, function(user){return user.id == userId})
  return result
}

//return new array removing any user with id 'userId'
function deleteuser(userId){
  var result = db.users.filter(function(e) {
    return e.id !== userId;
  });
  db.users = result;
  return
}


app.use(router.routes());

module.exports = app;
