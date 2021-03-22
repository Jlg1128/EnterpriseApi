/* eslint-disable no-return-assign */
/* eslint-disable max-len */
import { Next, Context } from 'koa';
import { MyResponse } from '../util/responseUtil';
import MenuDao from '../dao/menuDao';
import { Menu } from '../domain/menu';

let roleSortField = ['menu_id', 'create_time', 'update_time'];

const RolesController = {
  insertMenu: async (ctx: Context, next: Next) => {
    let { menu_name, icon, path } = ctx.request.body;
    let now = Date.now().toString();
    if (!menu_name) {
      ctx.body = MyResponse.paramWrong("菜单名称不能为空");
      return;
    }
    if (!path) {
      ctx.body = MyResponse.paramWrong("菜单路径不能为空");
      return;
    }
    let newMenu: Menu = {
      create_time: now,
      update_time: now,
      menu_name,
      icon: icon || '',
      path,
    };
    try {
      let oldMenu = await MenuDao.getMenuByMenuName(menu_name);
      if (oldMenu) {
        ctx.body = MyResponse.error("该菜单名称已存在");
        return;
      }
      let res = await MenuDao.insertMenu(newMenu);
      console.log("res", res);
      ctx.body = MyResponse.success("插入成功");
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  modifyMenu: async (ctx: Context, next: Next) => {
    let { ...menu } = ctx.request.body;
    if (!menu) {
      ctx.body = MyResponse.paramWrong("参数不能为空");
      return;
    }
    if (!menu.menu_id) {
      ctx.body = MyResponse.paramWrong("menuId不能为空");
      return;
    }
    try {
      let findMenu: Menu = await MenuDao.getMenuById(menu.menu_id);
      if (!findMenu) {
        ctx.body = MyResponse.error("该菜单不存在");
        return;
      }
      await MenuDao.modifyMenu({ ...findMenu, ...menu, update_time: Date.now().toString() });
      ctx.body = MyResponse.success("修改成功");
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error("异常错误");
    }
  },
  getMenuById: async (ctx: Context, next: Next) => {
    let { menu_id } = ctx.request.query;
    if (!menu_id) {
      ctx.body = MyResponse.paramWrong("menu_id 不能为空");
      return;
    }
    try {
      let menu = await MenuDao.getMenuById(Number(menu_id));
      ctx.body = MyResponse.success(menu);
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  getMenuList: async (ctx: Context, next: Next) => {
    let { pageSize, pageIndex, sortField } = ctx.request.query;
    if (Number(pageSize) < 0 || Number(pageIndex) < 0) {
      ctx.body = MyResponse.paramWrong("参数格式不正确");
      return;
    }
    let startPos = Number(pageSize) * (Number(pageIndex) - 1);
    sortField = sortField ? sortField.toString() : '';
    if (sortField && !roleSortField.includes(sortField)) {
      ctx.body = MyResponse.paramWrong("sortField不在排序fields里");
      return;
    }
    try {
      let result: { list: Array<Menu>, count: number } = null;
      result = await MenuDao.getMenus(Number(pageSize) || 10, Number(startPos) || 0, sortField);
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
  getAllMenus: async (ctx: Context, next: Next) => {
    try {
      let roles = await MenuDao.getAllMenu();
      ctx.body = MyResponse.success(roles);
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  deleteMenuById: async (ctx: Context, next: Next) => {
    let { menu_id } = ctx.request.body;
    if (!menu_id) {
      ctx.body = MyResponse.paramWrong("role_id不能为空");
      return;
    }
    try {
      let oldMenu = await MenuDao.getMenuById(menu_id);
      if (!oldMenu) {
        ctx.body = MyResponse.error("该菜单不存在");
        return;
      }
      let roles = await MenuDao.deleteMenuId(menu_id);
      if (roles && roles.affectedRows) {
        ctx.body = MyResponse.success("删除成功");
      } else {
        ctx.body = MyResponse.success("没有需要删除的");
      }
    } catch (error) {
      ctx.body = MyResponse.error(error || "数据库错误");
    }
  },
  isMenuNameRepeat: async (ctx: Context, next: Next) => {
    let { menu_name } = ctx.request.query;
    menu_name = menu_name ? menu_name.toString() : "";
    if (!menu_name) {
      ctx.body = MyResponse.paramWrong("角色名称不能为空");
      return;
    }
    try {
      let oldMenu = await MenuDao.getMenuByMenuName(menu_name);
      if (!oldMenu) {
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