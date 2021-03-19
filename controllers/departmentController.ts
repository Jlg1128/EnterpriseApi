/* eslint-disable max-len */
import { Next, Context } from 'koa';
import { MyResponse } from '../util/responseUtil';
import { Department } from '../domain/department';
import DepartmentDao from '../dao/departmentDao';

// department_id: number,
// department_name: string,
// create_time: string,
// update_time: string,
// leader_id: number,
const RolesController = {
  addDepartment: async (ctx: Context, next: Next) => {
    let { department_name, leader_id } = ctx.request.body;
    let now = Date.now().toString();
    let department: Department = {
      create_time: now,
      update_time: now,
      department_name,
      leader_id: leader_id || null,
    };
    if (!department_name) {
      ctx.body = MyResponse.paramWrong("部门名称不能为空");
      return;
    }
    try {
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