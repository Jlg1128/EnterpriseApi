/* eslint-disable no-unused-vars */
import { ORM_DB, ORM_DBUtil } from "dborm-mysql";
import mysql from 'mysql';

export type TableORMType = {
  db: ORM_DB,
  dbUtil: ORM_DBUtil,
  // 这里原生 mysql 是 any 类型，但是由于我们 orm 框架的实现，我可以理解为返回数组
  getList<T>(query: any, connection?: mysql.Connection): Promise<Array<T>>,
  findOne<T>(query: any, connection?: mysql.Connection): Promise<T>,
  getMapByField(query: any, connection?: mysql.Connection): Promise<Map<string, Array<any>>>,
  getGroupByField(query: any, connection?: mysql.Connection): Promise<Map<string, any>>,
  getListByIds(ids: Array<number>, connection?: mysql.Connection): Promise<Array<any>>,
  getCount(query: any, connection?: mysql.Connection): Promise<number>,
  pageQuery<T>(query: any, connection?: mysql.Connection): Promise<{ list: Array<T>, count: number }>,
  add(data: any, connection?: mysql.Connection): Promise<number>,
  delete(data: any, connection?: mysql.Connection): Promise<any>,
  updateByIds(data: any, ids?: Array<number>, connection?: mysql.Connection): Promise<any>,
  update(data: any, uid: number, connection?: mysql.Connection): Promise<any>,
  updateByQuery<T>(data: any, query: any, connection?: mysql.Connection): Promise<T>,
  get(uid: number, connection?: mysql.Connection): Promise<any>,
  createBulk(objs?: Array<any>, connection?: mysql.Connection): Promise<any>,
  updateBulk(objs?: Array<any>, connection?: mysql.Connection): Promise<any>,
  deleteByIds(ids?: Array<number>, connection?: mysql.Connection): Promise<any>,
  [key: string]: any
}