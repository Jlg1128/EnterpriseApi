import * as Koa from 'koa';
import { LogUtil } from '../util/logUtil';
import config from '../config';
import Log from '../middlewares/log/logger';
import md5Util from '../util/md5Util';
import { MyResponse } from '../util/responseUtil';

const Koa_Session = require('koa-session');

const bodyParser = require('koa-bodyparser');

const routes = require('../routes/index');

const { port, host } = config;

const ip = `${host}:${port}`;

const allowPath = [
  '/api/user/login',
  '/api/user/getUserByIdOrNickName',
  '/api/user/register',
  '/api/user/nickNameRepeat',
  '/api/user/getUserByNickname',
  '/api/user/isUserAlreatExit',
  '/api/user/isUserExit',
];

// 日志中间件
const logUtilMiddleWares = Log({
  env: process.env.NODE_ENV, // koa 提供的环境变量
  projectName: 'enterprise_management',
  appLogLevel: 'debug',
  dir: 'logs',
  serverIp: ip,
});

const app = new Koa();
app.listen(port).on('listening', () => {
  console.log(`正在监听${port}端口🐶🐶🐶`);
}).on("error", (err) => LogUtil.errLog(err.message));

app.use(logUtilMiddleWares);

app.keys = ['enterprise_management'];

const CONFIG = {
  key: 'login_status', // cookie key (default is koa:sess)
  maxAge: 14 * 86400 * 1000, // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true, // 是否可以overwrite    (默认default true)
  httpOnly: true, // cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true, // 签名默认true
  rolling: true, // 在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: true, // (boolean) renew session when session is nearly expired,
};

const session = Koa_Session(CONFIG, app);

app.use(session);

app.use(md5Util);

app.use(bodyParser());

app.use(async (ctx: Koa.Context, next: Koa.Next) => {
  if (!allowPath.includes(ctx.path) && !ctx.session.logged && !ctx.session.uid) { // 如果登录属性为undefined或者false，对应未登录和登录失败
    ctx.session.logged = false;
    ctx.body = MyResponse.noAuth("未登录");
    return;
  }
  await next();
});
// 注册路由
app.use(routes);
