import { Context } from 'koa';
import * as dayjs from 'dayjs';
import userDao from '../dao/userDao';
import { MyResponse } from '../util/responseUtil';
import { Wage } from '../domain/wage';
import wageDao from '../dao/wageDao';

const wageController = {
  sendWage: async (ctx: Context) => {
    let { officer_id, total_wage, target_id } = ctx.request.body;
    if (!(officer_id && total_wage && target_id)) {
      ctx.body = MyResponse.paramWrong("办公人员id或者工资或者用户id不能为空");
      return;
    }
    let year = dayjs().year();
    let month = dayjs().month() + 1;
    try {
      let user = await userDao.getUserById(target_id);
      if (!user) {
        ctx.body = MyResponse.error("该用户不存在");
        return;
      }
      let oldWage = await wageDao.getWageByUid(target_id, year, month);
      console.log(oldWage);
      if (oldWage) {
        ctx.body = MyResponse.error("抱歉，这个月已经对该用户发过工资了");
        return;
      }
      let officer = await userDao.getUserById(officer_id);
      let newWageItem: Wage = {
        officer_id,
        officer_name: officer.username,
        total_wage,
        wage_id: year + month + officer_id + target_id,
        target_id,
        target_name: user.username,
        send_year: dayjs().year(),
        send_month: dayjs().month() + 1,
      };
      let res = await wageDao.sendWage(newWageItem);
      console.log("res", res);
      ctx.body = MyResponse.success("发送成功");
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  getWageById: async (ctx: Context) => {
    let { target_id, year, month } = ctx.request.query;
    if (!target_id) {
      ctx.body = MyResponse.paramWrong("用户id不能为空");
      return;
    }
    if (!year) {
      ctx.body = MyResponse.paramWrong("工资年份不能为空");
      return;
    }
    if (!month) {
      ctx.body = MyResponse.paramWrong("工资月份不能为空");
      return;
    }
    try {
      let wage: Wage = await wageDao.getWageByUid(Number(target_id), Number(year), Number(month));
      ctx.body = MyResponse.success(wage);
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  getWagesByMonth: async (ctx: Context) => {
    let { year, month, pageSize, pageIndex } = ctx.request.query;
    if (!year || Number(year) < 0 || year.length !== 4) {
      ctx.body = MyResponse.paramWrong("年份格式不正确");
      return;
    }
    if (!month || Number(month) < 0) {
      ctx.body = MyResponse.paramWrong("月份格式不正确");
      return;
    }
    // @ts-ignore
    pageIndex = pageIndex || 1;
    let startPos = Number(pageSize) * Math.abs((Number(pageIndex) - 1));
    try {
      let wages = await wageDao.getWagesByMonth(Number(year), Number(month), Number(pageSize) || 10, Number(startPos) || 0);
      ctx.body = MyResponse.success(wages);
    } catch (error) {
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  modifyWage: async (ctx: Context) => {
    let { wage_id, total_wage } = ctx.request.body;
    if (!wage_id) {
      ctx.body = MyResponse.paramWrong("工资id不能为空");
      return;
    }
    if (!total_wage) {
      ctx.body = MyResponse.paramWrong("工资不能为空");
      return;
    }
    try {
      let res = await wageDao.modifyWage(Number(wage_id), total_wage.toString());
      ctx.body = MyResponse.success();
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
  deleteWageByWageId: async (ctx: Context) => {
    let { wage_id } = ctx.request.body;
    if (!wage_id) {
      ctx.body = MyResponse.paramWrong("工资id不能为空");
      return;
    }
    try {
      let res = await wageDao.deleteWageById(Number(wage_id));
      ctx.body = MyResponse.success(null, "删除成功");
    } catch (error) {
      console.log(error);
      ctx.body = MyResponse.error(error || "异常错误");
    }
  },
};

export default wageController;