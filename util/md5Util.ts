import { Next, Context } from 'koa';

const md5 = require('blueimp-md5');

const key = 'jlgTodo';

function md5Deep(str: string) {
  return md5(str || '', key);
}

export default async (ctx: Context, next: Next) => {
  if (!ctx.util) {
    ctx.util = {};
  }
  ctx.util.md5 = md5Deep;
  await next();
};
// export default md5Deep;