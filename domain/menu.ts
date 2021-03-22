export type Menu = {
  menu_id?: number,
  create_by?: {
    username: string;
    uid: number;
  },
  menu_name: string,
  path: string,
  icon: string,
  create_time: string,
  update_time: string,
}