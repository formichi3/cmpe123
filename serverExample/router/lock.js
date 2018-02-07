const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const app = new Koa();
app.use(bodyParser());
const _ = require('underscore')



//temp lock 'database'. this will be replaced by queries to google cloud datastore buckets
const db = {
  locks: [
    {
      type: 'lock',
      id: 1,
      permitted: []
    }, {
      type: 'lock',
      id: 2,
      permitted: []
    },
    {
      type: 'lock',
      id: 3,
      permitted: []
    }
  ]
}

//get all locks
router.get('/locks/', async (ctx, next) => {
  ctx.body = db.locks;
  await next();
});

//get a specific lock
router.get('/locks/:id', async (ctx, next) => {
  const id = ctx.params.id;
  var result = lockSearch(id);
  if (!result){
    ctx.body = {
      error: "no such lock"
    }
  }
  else {
    ctx.body = result;
  }
  await next();
});

//create new lock
router.post('/locks/:id', async (ctx, next) => {
  const id = parseInt(ctx.params.id);
  const lock = lockSearch(id);
  if (!lock){
    const newLock = {
      type: 'lock',
      id: id,
      permitted: []
    }
    db.locks.push(newLock)
    ctx.body = {
      result: "success",
      lockIdAdded: id
    }
  }
  else {
    ctx.body = {
      result: "error",
      msg: "lock already exists"
    }
  }
  await next();
});

//add users to lock's permitted list
router.post('/locks/:id/addUsers', async (ctx, next) => {
  const id = parseInt(ctx.params.id);
  const lock = lockSearch(id);
  if (!lock){
    ctx.body = {
      result: "error",
      msg: "lock does not exist"
    }
  }
  else {
    var newUsers = ctx.request.body.newUsers
    //var newUsers = [1,2,3]
    lock.permitted = _.union(lock.permitted, newUsers)
    ctx.body = {
      result: "success",
      lockId: lock.id,
      lockPermittedUsers: lock.permitted
    }
  }
  await next();
});

router.delete('/locks/:id', async (ctx, next) => {
  const id = parseInt(ctx.params.id);
  const lockExists = lockSearch(id);
  if (lockExists){
    ctx.body = {
      result: "success",
      lockIdRemoved: id
    }
  }
  else {
    ctx.body = {
      result: "error",
      msg: "lock did not exist"
    }
  }
  await next();
});

//returns lock if exists, null if not
function lockSearch(lockId) {
  var result = _.find(db.locks, function(lock){return lock.id == lockId})
  return result
}

//return new array removing any lock with id 'lockId'
function deleteLock(lockId){
  var result = db.locks.filter(function(e) {
    return e.id !== lockId;
  });
  db.locks = result;
  return
}


app.use(router.routes());

module.exports = app;
