import { Next, Context } from 'koa';
import userService from '../service/userService';
import { MyResponse } from '../util/responseUtil';
import { User } from '../domain/user';

// 用户相关
const userController = {
  login: async (ctx: Context, next: Next) => {
    let { username, password } = ctx.request.body;
    password = password.toString();
    if (username == null || password == null) {
      ctx.body = MyResponse.paramWrong("参数缺失");
      return;
    }
    try {
      let user = await userService.getUserByNickname(username);
      if (user == null) {
        ctx.body = MyResponse.error("用户不存在");
        return;
      }
      if (user.password !== ctx.util.md5(password)) {
        ctx.body = MyResponse.error("用户名或者密码错误");
        return;
      }

      delete user.password;
      ctx.session.logged = true;
      ctx.session.uid = user.uid;
      ctx.body = MyResponse.success(user, "执行成功");
    } catch (error) {
      ctx.log.error(error);
      ctx.session.logged = false;
      ctx.body = MyResponse.error(error);
    }
  },
  register: async (ctx: Context, next: Next) => {
    let {
      username,
      password,
      avatar = null,
      phone_number = null,
      email = null,
    } = ctx.request.body;
    try {
      if (!username || !password) {
        ctx.body = MyResponse.error("用户名或者密码不能为空");
        return;
      }
      if (username.length > 20) {
        ctx.body = MyResponse.error("用户名不能超过20个字符");
        return;
      }
      if (!/^[\s\S]{8,20}$/g.test(password)) {
        ctx.body = MyResponse.error("密码长度在8-20位");
        return;
      }
      if (!/^[\u4e00-\u9fa50-9A-Za-z_]+$/g.test(username)) {
        ctx.body = MyResponse.error("仅支持中文、数字、英文大小写、下划线。");
        return;
      }
      let res = await userService.getUserByNickname(username);
      if (res != null) {
        ctx.body = MyResponse.success(null, "用户名已存在");
        return;
      }
      password = ctx.util.md5(password);
      let now = Date.now().toString();
      let user: Partial<User> = {
        username,
        create_time: now,
        update_time: now,
        password,
        avatar,
        phone_number: phone_number ? phone_number.toString() : null,
        email,
        sex: 'male',
      };
      await userService.insertUser(user);
      let createdUser = await userService.getUserByNickname(username);
      delete createdUser.password;
      ctx.body = MyResponse.success(createdUser, "注册成功");
      ctx.session.uid = createdUser.uid;
      ctx.session.logged = true;
    } catch (error) {
      ctx.session.logged = false;
      ctx.session.uid = null;
      ctx.log.error(error);
      ctx.body = MyResponse.error("异常错误");
    }
  },
  quit: async (ctx: Context, next: Next) => {
    ctx.session.logged = false;
    ctx.session.uid = null;
    ctx.body = MyResponse.success("退出成功");
  },
  userInfoIfRepeat: async (ctx: Context, next: Next) => {
    let { type, value } = ctx.request.query;
    if (!type || !value) {
      ctx.body = MyResponse.error("请求类型或者值不能为空");
      return;
    }
    let user = null;
    if (type !== 'username' && type !== 'email' && type !== 'phone' && type !== 'uid') {
      ctx.body = MyResponse.error('没有对应的校验类型');
      return;
    }
    try {
      if (type === 'username') {
        user = await userService.getUserByNickname(value.toString());
      }
      if (type === 'email') {
        user = await userService.getUserByEmail(value.toString());
      }
      if (type === 'phone') {
        user = await userService.getUserByPhoneNumber(value.toString());
      }
      if (type === 'uid') {
        let { uid } = ctx.session;
        user = await userService.getUserById(uid);
      }
    } catch (error) {
      ctx.log.error(error);
      ctx.body = MyResponse.error(error);
    }
    ctx.body = !user ? MyResponse.success(null) : MyResponse.error(`${type}已存在`);
  },
  resetPassword: async (ctx: Context, next: Next) => {
    const { uid } = ctx.request.body;
    if (!uid) {
      ctx.body = MyResponse.paramWrong("用户id不能为空");
      return;
    }
    let user: User = await userService.getUserById(uid);
    if (!user) {
      ctx.body = MyResponse.error("用户不存在");
      return;
    }
    try {
      let res = await userService.modifyUser(uid, {
        password: ctx.util.md5(12345678),
      });
      if (res === 'ok') {
        ctx.body = MyResponse.success(null, '密码重置成功');
      } else {
        ctx.body = MyResponse.error('修改失败');
      }
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error);
    }
  },
  modifyUser: async (ctx: Context, next: Next) => {
    const { uid, username, email, phone_number, avatar, password, roleIds, department_id } = ctx.request.body;
    if (!uid) {
      ctx.body = MyResponse.paramWrong("用户id不能为空");
      return;
    }
    let user: User = await userService.getUserById(uid);
    if (!user) {
      ctx.body = MyResponse.error("用户不存在");
      return;
    }
    try {
      let res = await userService.modifyUser(uid, {
        username: username || user.username,
        email: email || user.email,
        phone_number: phone_number || user.phone_number,
        avatar: avatar || user.avatar,
        password: password ? ctx.util.md5(password) : password,
        roleIds: roleIds && Array.isArray(roleIds) ? JSON.stringify(roleIds) : user.roleIds,
        update_time: Date.now().toString(),
        department_id,
      });
      if (res === 'ok') {
        ctx.body = MyResponse.success(null, '修改用户信息成功');
      } else {
        ctx.body = MyResponse.error('修改失败');
      }
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error);
    }
  },
  modifyAvatar: async (ctx: Context, next: Next) => {
    const { avatar } = ctx.request.body;
    let { uid } = ctx.session;
    let user: User = await userService.getUserById(uid);
    if (!user) {
      ctx.body = MyResponse.error("用户不存在");
      return;
    }

    try {
      let res = await userService.modifyAvatar(uid, {
        avatar,
      });
      if (res === 'ok') {
        ctx.body = MyResponse.success(null, '修改用户头像成功');
      } else {
        ctx.body = MyResponse.error('修改失败');
      }
    } catch (error) {
      ctx.log.error(error);
      ctx.body = MyResponse.error(error);
    }
  },
  deleteUserByUid: async (ctx: Context, next: Next) => {
    let { uid } = ctx.request.body;
    if (!uid) {
      ctx.body = MyResponse.paramWrong("用户id不能为空");
      return;
    }
    try {
      let user: User = await userService.getUserById(uid);
      if (user == null) {
        ctx.body = MyResponse.success("用户不存在");
      } else {
        let res = await userService.deleteUser(uid);
        console.log(res);
        ctx.body = MyResponse.success("删除成功");
      }
    } catch (error) {
      ctx.log.error(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  getUserById: async (ctx: Context, next: Next) => {
    let { uid } = ctx.session;
    try {
      let user: User = null;
      user = await userService.getUserById(uid);
      if (user == null) {
        ctx.body = MyResponse.success("用户不存在");
      } else {
        delete user.password;
        ctx.body = MyResponse.success(user);
      }
    } catch (error) {
      ctx.log.error(error);
      ctx.body = MyResponse.error("");
    }
  },
  // 用户名是否已经存在
  isUserAlreatExit: async (ctx: Context, next: Next) => {
    let { username } = ctx.request.query;
    if (username == null) {
      ctx.body = MyResponse.paramWrong("用户名不能为空");
      return;
    }
    try {
      let user: User = null;
      user = await userService.getUserByNickname(username.toString());
      if (user != null) {
        ctx.body = MyResponse.error("用户已存在");
      } else {
        ctx.body = MyResponse.success(null);
      }
    } catch (error) {
      console.log(error);
      ctx.log.error(error);
      ctx.body = MyResponse.error("");
    }
  },
  // 用户名是否已经存在
  isUserExit: async (ctx: Context, next: Next) => {
    let { username } = ctx.request.query;
    if (username == null) {
      ctx.body = MyResponse.paramWrong("用户名不能为空");
      return;
    }
    try {
      let user: User = null;
      user = await userService.getUserByNickname(username.toString());
      if (user == null) {
        ctx.body = MyResponse.error("用户不存在");
      } else {
        ctx.body = MyResponse.success(null);
      }
    } catch (error) {
      ctx.log.error(error);
      ctx.body = MyResponse.error("");
    }
  },
};

export default userController;