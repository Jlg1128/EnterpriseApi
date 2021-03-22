/* eslint-disable max-len */
import { Roles } from "domain/roles";
import RoleDb from '../db/roledb';

const RolesDao = {
  async insertRole(role: Roles) {
    let res = await RoleDb.add(role);
    return res;
  },
  async modifyRoles(role_id: Roles, role_name: string, menus: string, update_time: string) {
    let res = await RoleDb.updateByQuery({
      role_name,
      menus,
      update_time,
    }, {
      inFields: {
        role_id: [role_id],
      },
    });
    return res;
  },
  async modifyRoleMenu(role_id: Roles, menus: string) {
    let res = await RoleDb.updateByQuery({
      menus,
    }, {
      inFields: {
        role_id: [role_id],
      },
    });
    return res;
  },
  async deleteRoleByRoleId(role_id: number) {
    let res = await RoleDb.delete({
      role_id,
    });
    return res;
  },
  async getSingleRoleById(role_id: number): Promise<Partial<Roles>> {
    let res = await RoleDb.findOne({
      role_id,
    });
    return res;
  },
  getRoleList: async (pageSize: number, startPos: number, sortField?: string): Promise<{ list: Array<Roles>, count: number } > => {
    try {
      let RoleList: { list: Array<Roles>, count: number } = await RoleDb.pageQuery<Roles>({
        initSql: 'select * from roles',
        offset: startPos,
        limit: pageSize,
        sort: sortField ? [sortField.concat(":1")] : "",
      });
      return RoleList;
    } catch (error) {
     console.log(error);
    }
  },
  async getAllRoles(): Promise<Roles[]> {
    let res = await RoleDb.getList<Roles>({});
    return res;
  },
   getRolesByRoleName: async (role_name: string): Promise<Roles> => {
    let res = await RoleDb.findOne<Roles>({
        role_name,
    });
    return res;
  },
};

export default RolesDao;