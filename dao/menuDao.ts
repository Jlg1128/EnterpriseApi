/* eslint-disable max-len */
import { Menu } from "domain/menu";
import Menudb from '../db/menudb';

const MenuDao = {
  async insertMenu(menu: Menu) {
    console.log(menu);
    let res = await Menudb.add(menu);
    return res;
  },
  async modifyMenu(menu: Menu) {
    let res = await Menudb.updateByQuery({
      menu_name: menu.menu_name,
      update_time: menu.update_time,
      path: menu.path,
      icon: menu.icon,
    }, {
      inFields: {
        menu_id: [menu.menu_id],
      },
    });
    return res;
  },
  async deleteMenuId(menu_id: number) {
    let res = await Menudb.delete({
      menu_id,
    });
    return res;
  },
  async getMenuById(menu_id: number): Promise<Menu> {
    let res = await Menudb.findOne<Menu>({
      menu_id,
    });
    return res;
  },
  getMenus: async (pageSize: number, startPos: number, sortField?: string): Promise<{ list: Array<Menu>, count: number } > => {
    try {
      let RoleList: { list: Array<Menu>, count: number } = await Menudb.pageQuery<Menu>({
        initSql: 'select * from menu',
        offset: startPos,
        limit: pageSize,
        sort: sortField ? [sortField.concat(":1")] : "",
      });
      return RoleList;
    } catch (error) {
     console.log(error);
    }
  },
  async getAllMenu(): Promise<Menu[]> {
    let res = await Menudb.getList<Menu>({});
    return res;
  },
   getMenuByMenuName: async (menu_name: string): Promise<Menu> => {
    let res = await Menudb.findOne<Menu>({
        menu_name,
    });
    return res;
  },
};

export default MenuDao;