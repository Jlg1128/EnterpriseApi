import { Department } from 'domain/department';
import DepartmentDB from '../db/departmentdb';

const departmentDao = {
  async addDepartment(department: Department): Promise<number> {
    let res = await DepartmentDB.add(department);
    return res;
  },
  async deleteDepartmentById(department_id: number) {
    let res = await DepartmentDB.delete({
      department_id,
    });
    return res;
  },
  async deleteDepartmentByName(department_name: string) {
    let res = await DepartmentDB.delete({
      department_name,
    });
    return res;
  },
  async getDepartmentById(department_id: number): Promise<Department> {
    let res = await DepartmentDB.findOne<Department>({
      department_id,
    });
    return res;
  },
  async getAllDepartment(): Promise<Department[]> {
    let res = await DepartmentDB.getList<Department>({});
    return res;
  },
  async getDepartmentByName(department_name: string): Promise<Department> {
    let res = await DepartmentDB.findOne<Department>({
      department_name,
    });
    return res;
  },
  async modifyDepartmentName(department_id: number, department_name: string): Promise<Department> {
    let res = await DepartmentDB.updateByQuery<Department>({
      department_name,
      update_time: Date.now().toString(),
    }, {
      inFields: {
        department_id: [department_id],
      },
    });
    return res;
  },
  async modifyDepartmentLeader(department_id: number, leader_id: number): Promise<Department> {
    let res = await DepartmentDB.updateByQuery<Department>({
      leader_id,
      update_time: Date.now().toString(),
    }, {
      inFields: {
        department_id: [department_id],
      },
    });
    return res;
  },
};

export default departmentDao;