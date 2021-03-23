import { User } from "./user";

export type Department = {
  department_id?: number,
  department_name: string,
  create_time: string,
  update_time: string,
  leader_id: number,
  leader_name: string,
  members: User[]
}