/* eslint-disable no-return-assign */
/* eslint-disable max-len */
import { Next, Context } from 'koa';
import { MyResponse } from '../util/responseUtil';
import { Roles } from '../domain/roles';
import RolesDao from '../dao/rolesDao';
import MenuDao from '../dao/menuDao';
import { Menu } from '../domain/menu';

let roleSortField = ['role_id', 'create_time', 'update_time'];

const RolesController = {
  modifyRoles: async (ctx: Context, next: Next) => {
    let { role_id, role_name, menus } = ctx.request.body;
    if (!role_id) {
      ctx.body = MyResponse.paramWrong("角色id不能为空");
      return;
    }
    if (!menus || !Array.isArray(menus)) {
      ctx.body = MyResponse.paramWrong("菜单格式不正确");
      return;
    }
    try {
      let role = await RolesDao.getSingleRoleById(role_id);
      if (!role) {
        ctx.body = MyResponse.error("该角色不存在");
        return;
      }
      let oldMenus = await MenuDao.getAllMenu();
      let newMenus: Partial<Menu>[] = [];
      oldMenus.forEach((oldMenu) => {
        menus.forEach((item: number) => {
          if (item.toString() === oldMenu.menu_id.toString()) {
            newMenus.push(oldMenu);
          }
        });
      });
      let update_time = Date.now().toString();
      await RolesDao.modifyRoles(role_id, role_name || role.role_name, JSON.stringify(newMenus), update_time);
      ctx.body = MyResponse.success("修改成功");
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error("异常错误");
    }
  },

  insertRole: async (ctx: Context, next: Next) => {
    let { role_name, menus } = ctx.request.body;
    if (!menus || !Array.isArray(menus)) {
      ctx.body = MyResponse.paramWrong("菜单格式不正确");
      return;
    }
    try {
      let oldMenus = await MenuDao.getAllMenu();
      let newMenus: Partial<Menu>[] = [];
      oldMenus.forEach((oldMenu) => {
        menus.forEach((item: Menu) => {
          if (item.toString() === oldMenu.menu_id.toString()) {
            newMenus.push(oldMenu);
          }
        });
      });
      let now = Date.now().toString();
      let newRole: Roles = {
        // @ts-ignore
        menus: newMenus,
        create_time: now,
        update_time: now,
        role_name,
      };
      if (!role_name) {
        ctx.body = MyResponse.paramWrong("角色名称不能为空");
        return;
      }
      let oldRole = await RolesDao.getRolesByRoleName(role_name);
      if (oldRole) {
        ctx.body = MyResponse.error("该角色名称已存在");
        return;
      }
      let res = await RolesDao.insertRole(newRole);
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
      ctx.body = MyResponse.success(roles);
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  getRoleList: async (ctx: Context, next: Next) => {
    let { pageSize, pageIndex, sortField } = ctx.request.query;
    if (Number(pageSize) < 0 || Number(pageIndex) < 0) {
      ctx.body = MyResponse.paramWrong("参数格式不正确");
      return;
    }
    let startPos = Number(pageSize) * Math.abs((Number(pageIndex) - 1));
    sortField = sortField ? sortField.toString() : '';
    if (sortField && !roleSortField.includes(sortField)) {
      ctx.body = MyResponse.paramWrong("sortField不在排序fields里");
      return;
    }
    try {
      let result: { list: Array<Roles>, count: number } = null;
      result = await RolesDao.getRoleList(Number(pageSize) || 10, Number(startPos) || 0, sortField);
      if (result.list == null) {
        ctx.body = MyResponse.success("用户列表不存在");
      } else {
        ctx.body = MyResponse.success(result);
      }
    } catch (error) {
      ctx.log.error(error);
      console.log(error);
      ctx.body = MyResponse.error("");
    }
  },
  getAllRoles: async (ctx: Context, next: Next) => {
    try {
      let roles = await RolesDao.getAllRoles();
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
      console.log(role_name);
      console.log(oldRole);
      console.log(!oldRole);
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