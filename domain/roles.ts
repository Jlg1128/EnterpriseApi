import { Menu } from "./menu";

export type Roles = {
  role_id?: number,
  menus: Menu[],
  role_name: string,
  create_time: string,
  update_time: string,
}