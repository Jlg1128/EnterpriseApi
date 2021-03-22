import { Roles } from "./roles";

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
}