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
  async getRolesByIds(role_ids: number[] | string[]): Promise<Array<Roles>> {
    let res = await RoleDb.getList<Roles>({
      inFields: {
        role_id: role_ids,
      },
    });
    return res;
  },
   getRolesByRoleName: async (role_name: string): Promise<Array<Roles>> => {
    let res = await RoleDb.getList<Roles>({
      inFields: {
        role_name,
      },
    });
    return res;
  },
};

export default RolesDao;