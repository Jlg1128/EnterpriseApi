/* eslint-disable max-len */
import { Next, Context } from 'koa';
import { MyResponse } from '../util/responseUtil';
import { Roles } from '../domain/roles';
import RolesDao from '../dao/rolesDao';

const RolesController = {
  modifyRoles: async (ctx: Context, next: Next) => {
    let { role_id, role_name, menus } = ctx.request.body;
    if (!role_id) {
      ctx.body = MyResponse.paramWrong("角色id不能为空");
      return;
    }
    try {
      let role = await RolesDao.getSingleRoleById(role_id);
      if (!role) {
        ctx.body = MyResponse.error("该角色不存在");
        return;
      }
      let finalMenu = menus && Array.isArray(menus) ? JSON.stringify(menus) : role.menus;
      let update_time = Date.now().toString();
      await RolesDao.modifyRoles(role_id, role_name || role.role_name, finalMenu, update_time);
      ctx.body = MyResponse.success("修改成功");
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error("异常错误");
    }
  },
  insertRole: async (ctx: Context, next: Next) => {
    let { role_name, menus } = ctx.request.body;
    let now = Date.now().toString();
    let newRole: Roles = {
      menus: menus && Array.isArray(menus) ? JSON.stringify(menus) : JSON.stringify([]),
      create_time: now,
      update_time: now,
      role_name,
    };
    if (!role_name) {
      ctx.body = MyResponse.paramWrong("角色名称不能为空");
      return;
    }
    try {
      let oldRole = await RolesDao.getRolesByRoleName(role_name);
      if (oldRole) {
        ctx.body = MyResponse.error("该角色名称已存在");
        return;
      }
      let res = await RolesDao.insertRole(newRole);
      console.log("res", res);
      ctx.body = MyResponse.success("插入成功");
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  getSingleRoleById: async (ctx: Context, next: Next) => {
    let { role_id } = ctx.request.query;
    if (!role_id) {
      ctx.body = MyResponse.paramWrong("role_id 不能为空");
      return;
    }
    try {
      let roles = await RolesDao.getSingleRoleById(Number(role_id));
      console.log("res", roles);
      ctx.body = MyResponse.success(roles);
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  getRolesByIds: async (ctx: Context, next: Next) => {
    let { role_ids } = ctx.request.query;
    role_ids = role_ids.toString() && role_ids.toString().split(",");
    if (!role_ids || !Array.isArray(role_ids)) {
      ctx.body = MyResponse.paramWrong("role_ids格式错误");
      return;
    }
    try {
      let roles = await RolesDao.getRolesByIds(role_ids);
      console.log("res", roles);
      ctx.body = MyResponse.success(roles);
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  deleteRoleByRoleId: async (ctx: Context, next: Next) => {
    let { role_id } = ctx.request.body;
    if (!role_id) {
      ctx.body = MyResponse.paramWrong("role_id不能为空");
      return;
    }
    try {
      let oldRole = await RolesDao.getSingleRoleById(role_id);
      if (!oldRole) {
        ctx.body = MyResponse.error("该角色不存在");
        return;
      }
      let roles = await RolesDao.deleteRoleByRoleId(role_id);
      if (roles && roles.affectedRows) {
        ctx.body = MyResponse.success("删除成功");
      } else {
        ctx.body = MyResponse.success("没有需要删除的");
      }
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  isRoleNameRepeat: async (ctx: Context, next: Next) => {
    let { role_name } = ctx.request.query;
    role_name = role_name ? role_name.toString() : "";
    if (!role_name) {
      ctx.body = MyResponse.paramWrong("角色名称不能为空");
      return;
    }
    try {
      let oldRole = await RolesDao.getRolesByRoleName(role_name);
      if (!oldRole) {
        ctx.body = MyResponse.success(null);
      } else {
        ctx.body = MyResponse.error("该角色已经存在");
      }
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
};

export default RolesController;