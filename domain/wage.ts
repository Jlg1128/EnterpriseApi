// 工资
export type Wage = {
  wage_id?: number,
  officer_id: number,
  officer_name: string,
  total_wage: string,
  target_id: number,
  target_name: string,
  send_year: number,
  send_month: number
}