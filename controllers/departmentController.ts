/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import { Next, Context } from 'koa';
import { MyResponse } from '../util/responseUtil';
import { Department } from '../domain/department';
import DepartmentDao from '../dao/departmentDao';
import userDao from '../dao/userDao';

const RolesController = {
  addDepartment: async (ctx: Context, next: Next) => {
    try {
      let { department_name, leader_id, members } = ctx.request.body;
      let now = Date.now().toString();
      let leader = await userDao.getUserById(leader_id);
      if (!leader) {
        ctx.body = MyResponse.error("主管不存在");
        return;
      }
      let finalMembers = [];
      if (members && Array.isArray(members)) {
        for (let i = 0; i < members.length; i++) {
          let user = await userDao.getUserById(members[i]);
          console.log(user);
          finalMembers.push(user);
        }
      } else {
        members = [];
      }
      let department: Department = {
        create_time: now,
        update_time: now,
        department_name,
        leader_id: leader_id || null,
        leader_name: leader.username,
        members: finalMembers,
      };
      if (!department_name) {
        ctx.body = MyResponse.paramWrong("部门名称不能为空");
        return;
      }
      if (await DepartmentDao.getDepartmentByName(department_name)) {
        ctx.body = MyResponse.error("部门名称已存在");
      } else {
        let res = await DepartmentDao.addDepartment(department);
        ctx.body = MyResponse.success(null, "插入成功");
      }
    } catch (error) {
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  deleteDepartmentById: async (ctx: Context, next: Next) => {
    let { department_id } = ctx.request.body;
    if (!department_id) {
      ctx.body = MyResponse.paramWrong("部门id不能为空");
      return;
    }
    try {
      let oldDepartment = await DepartmentDao.getDepartmentById(department_id);
      if (!oldDepartment) {
        ctx.body = MyResponse.error("该部门不存在");
      } else {
        let res = await DepartmentDao.deleteDepartmentById(department_id);
        ctx.body = MyResponse.success(null, "删除成功");
      }
    } catch (error) {
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  getDepartmentById: async (ctx: Context, next: Next) => {
    let { department_id } = ctx.request.query;
    if (!department_id) {
      ctx.body = MyResponse.paramWrong("部门id不能为空");
      return;
    }
    try {
      let res = await DepartmentDao.getDepartmentById(Number(department_id));
      if (res) {
        ctx.body = MyResponse.success(res);
      } else {
        ctx.body = MyResponse.error("该部门不存在");
      }
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  getAllDepartment: async (ctx: Context, next: Next) => {
    try {
      let res = await DepartmentDao.getAllDepartment();
      ctx.body = MyResponse.success(res);
    } catch (error) {
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  modifyDepartment: async (ctx: Context, next: Next) => {
    let { department_id, department_name, leader_id, members } = ctx.request.body;
    try {
      let oldDepartment = await DepartmentDao.getDepartmentById(department_id);
      if (!oldDepartment) {
        ctx.body = MyResponse.error("该部门不存在");
        return;
      }
      if (oldDepartment.department_name !== department_name) {
        let exitDepartment = await DepartmentDao.getDepartmentByName(department_name);
        if (exitDepartment) {
          ctx.body = MyResponse.error("部门名称已存在");
          return;
        }
      }

      leader_id = leader_id || oldDepartment.leader_id.toString();
      let leader = await userDao.getUserById(leader_id);
      members = members && Array.isArray(members) ? members : oldDepartment.members || [];
      if (!leader) {
        ctx.body = MyResponse.error("leader不存在");
        return;
      }
      let finalMembers = [];
      if (members && Array.isArray(members)) {
        for (let i = 0; i < members.length; i++) {
          let user = await userDao.getUserById(members[i]);
          console.log(user);
          finalMembers.push(user);
        }
      } else {
        members = [];
      }
      console.log("finalMembers", finalMembers);
      let newDepartment: Department = {
        ...oldDepartment,
        department_name,
        leader_id,
        leader_name: leader.username,
        members: finalMembers,
        update_time: Date.now().toString(),
      };
      let res = await DepartmentDao.modifyDepartment(newDepartment);
      ctx.body = MyResponse.success(null, '更新成功');
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  modifyDepartmentName: async (ctx: Context, next: Next) => {
    let { department_id, department_name } = ctx.request.body;
    try {
      let oldDepartment = await DepartmentDao.getDepartmentById(department_id);
      if (!oldDepartment) {
        ctx.body = MyResponse.error("该部门不存在");
        return;
      }
      oldDepartment = await DepartmentDao.getDepartmentByName(department_name);
      console.log("oldDepartment", oldDepartment);
      if (oldDepartment) {
        ctx.body = MyResponse.error("部门名称已存在");
        return;
      }
      let res = await DepartmentDao.modifyDepartmentName(department_id, department_name);
      ctx.body = MyResponse.success(null, '更新成功');
      console.log('更新res', res);
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  modifyDepartmentLeader: async (ctx: Context, next: Next) => {
    let { department_id, leader_id } = ctx.request.body;
    try {
      let oldDepartment = await DepartmentDao.getDepartmentById(department_id);
      if (!oldDepartment) {
        ctx.body = MyResponse.error("该部门不存在");
        return;
      }
      let res = await DepartmentDao.modifyDepartmentLeader(department_id, leader_id);
      ctx.body = MyResponse.success(null, '更新成功');
      console.log('更新res', res);
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  isDepartmentNameRepeat: async (ctx: Context, next: Next) => {
    let { department_name } = ctx.request.query;
    if (!department_name) {
      ctx.body = MyResponse.error("部门名称不能为空");
      return;
    }
    try {
      let oldDepartment = await DepartmentDao.getDepartmentByName(department_name.toString());
      if (oldDepartment) {
        ctx.body = MyResponse.error("该部门名称已经存在");
        return;
      }
      ctx.body = MyResponse.success();
    } catch (error) {
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
};

export default RolesController;