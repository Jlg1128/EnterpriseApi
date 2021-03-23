import { Department } from "./department";
import { Roles } from "./roles";
import { Wage } from "./wage";

export type User = {
  uid?: number,
  username: string,
  password: string,
  avatar: string,
  create_time: string,
  update_time: string,
  roleIds: Roles[],
  phone_number: string,
  email: string,
  sex: 'male' | 'femail',
  department_id: number,
  department?: Department,
  wage?: Wage,
}