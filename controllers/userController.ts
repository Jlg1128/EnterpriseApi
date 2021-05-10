import { Next, Context } from 'koa';
import * as dayjs from 'dayjs';
import RolesDao from '../dao/rolesDao';
import userDao from '../dao/userDao';
import userService from '../service/userService';
import { MyResponse } from '../util/responseUtil';
import { User } from '../domain/user';
import departmentDao from '../dao/departmentDao';
import wageDao from '../dao/wageDao';

let userSortField = ['uid', 'create_time', 'update_time', 'sex'];

// 用户相关
const userController = {
  login: async (ctx: Context, next: Next) => {
    let { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = MyResponse.paramWrong("参数缺失");
      return;
    }
    password = password.toString();
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
      let department = await departmentDao.getDepartmentById(user.department_id);
      let wage = await wageDao.getWageByUid(user.uid, dayjs().year(), dayjs().month() + 1);
      // let totalPaths = (await MenuDao.getAllMenu()).map((item) => item.menu_id);
      user.department = department;
      user.wage = wage;
      ctx.session.logged = true;
      // if (user.roleIds.length) {
      //   let paths = user.roleIds.map((role) => role.menus.map((menu) => menu.menu_id))[0];
      //   ctx.session.authsPaths = paths;
      //   ctx.session.totalPaths = totalPaths;
      // } else {
      //   ctx.session.authsPaths = [];
      // }
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
      roleIds = [],
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
      let role_name_list = await RolesDao.getAllRoles();
      let newRoles = [];
      if (roleIds && Array.isArray(roleIds)) {
        role_name_list.forEach((role_name_item) => {
          roleIds.forEach((item: number) => {
            if (item === role_name_item.role_id) {
              newRoles.push(role_name_item);
            }
          });
        });
      }
      let user: Partial<User> = {
        username,
        create_time: now,
        update_time: now,
        password,
        avatar,
        roleIds: newRoles,
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
    if (type !== 'username' && type !== 'email' && type !== 'phone_number' && type !== 'uid') {
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
      if (type === 'phone_number') {
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
      let role_name_list = await RolesDao.getAllRoles();
      let newRoles = [];
      if (roleIds && Array.isArray(roleIds)) {
        role_name_list.forEach((role_name_item) => {
          roleIds.forEach((item: number) => {
            if (item === role_name_item.role_id) {
              newRoles.push(role_name_item);
            }
          });
        });
      }
      let res = await userService.modifyUser(uid, {
        username: username || user.username,
        email: email || user.email,
        phone_number: phone_number || user.phone_number,
        avatar: avatar || user.avatar,
        password: password ? ctx.util.md5(password) : user.password,
        roleIds: newRoles,
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
    // let { uid } = ctx.session;
    let { uid } = ctx.request.query;
    if (!uid) {
      ctx.body = MyResponse.error("用户id不能为空");
      return;
    }
    try {
      let user: User = null;
      user = await userService.getUserById(Number(uid));
      if (user == null) {
        ctx.body = MyResponse.error("用户不存在");
      } else {
        delete user.password;
        let department = await departmentDao.getDepartmentById(user.department_id);
        let wage = await wageDao.getWageByUid(Number(uid), dayjs().year(), dayjs().month() + 1);
        user.department = department;
        user.wage = wage;
        ctx.body = MyResponse.success(user);
      }
    } catch (error) {
      ctx.log.error(error);
      ctx.body = MyResponse.error("");
    }
  },
  getUserLogined: async (ctx: Context) => {
    let { uid } = ctx.session;
    // let { uid } = ctx.request.query;
    if (!uid) {
      ctx.body = MyResponse.noAuth("用户登录已过期");
      return;
    }
    try {
      let user: User = null;
      user = await userService.getUserById(Number(uid));
      if (user == null) {
        ctx.body = MyResponse.error("用户不存在");
      } else {
        delete user.password;
        let department = await departmentDao.getDepartmentById(user.department_id);
        let wage = await wageDao.getWageByUid(user.uid, dayjs().year(), dayjs().month() + 1);
        user.department = department;
        user.wage = wage;
        ctx.body = MyResponse.success(user);
      }
    } catch (error) {
      ctx.log.error(error);
      ctx.body = MyResponse.error("");
    }
  },
  getAllUser: async (ctx: Context) => {
    try {
      let users = await userDao.getAllUser();
      console.log(users);
      users.forEach((item) => {
        delete item.password;
      });
      ctx.body = MyResponse.success(users);
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  getUserList: async (ctx: Context, next: Next) => {
    let { pageSize, pageIndex, sortField } = ctx.request.query;
    if (Number(pageSize) < 0 || Number(pageIndex) < 0) {
      ctx.body = MyResponse.paramWrong("参数格式不正确");
      return;
    }
    let startPos = Number(pageSize) * (Number(pageIndex) - 1);
    sortField = sortField ? sortField.toString() : '';
    if (sortField && !userSortField.includes(sortField)) {
      ctx.body = MyResponse.paramWrong("sortField不在排序fields里");
      return;
    }
    try {
      let result: { list: Array<User>, count: number } = null;
      result = await userDao.getUserList(Number(pageSize) || 10, Number(startPos) || 0, sortField);
      if (result.list == null) {
        ctx.body = MyResponse.success("用户列表不存在");
      } else {
        ctx.body = MyResponse.success(result);
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