import { Wage } from '../domain/wage';
import WageDB from '../db/wagedb';

export default {
  sendWage: async (wage: Wage) => {
    let res = await WageDB.add(wage);
    return res;
  },
  getWageByUid: async (uid: number, send_year: number, send_month: number) => {
    let res = await WageDB.findOne<Wage>(
      {
        uid,
        send_year,
        send_month,
      },
    );
    return res;
  },
  getWagesByMonth: async (send_year: number, send_month: number) => {
    let res = await WageDB.getList<Wage>({
      send_year,
      send_month,
    });
    return res;
  },
  deleteWageById: async (wage_id: number) => {
    let res = await WageDB.delete({
      wage_id,
    });
    return res;
  },
  modifyWage: async (wage_id: number, total_wage) => {
    let res = await WageDB.updateByQuery(
      {
        total_wage,
      },
      {
        inFields: {
          wage_id: [wage_id],
        },
      },
    );
    return res;
  },
};