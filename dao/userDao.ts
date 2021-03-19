/* eslint-disable max-len */
// user相关数据库操作

import { User } from '../domain/user';
import Userdb from '../db/userdb';

export default {
  getUserById: async (uid: number): Promise<User> => {
    let user: User = await Userdb.findOne(
      {
        uid,
      },
    );
    return user;
  },
  getUserByNickname: async (username: string): Promise<User> => {
      let user: User = await Userdb.findOne(
        {
          username,
        },
      );
      return user;
  },
  getUserByEmail: async (email: string): Promise<User> => {
    let user: User = await Userdb.findOne(
      {
        email,
      },
    );
    return user;
  },
  getUserByPhoneNumber: async (phoneNumber: string): Promise<User> => {
    let user: User = await Userdb.findOne(
      {
        phone_number: phoneNumber,
      },
    );
    return user;
  },
  getAllUsers: async (): Promise<Array<User>> => {
    let userList: Promise<User[]> = Userdb.getList<User>({});
    return userList;
  },

  insertUser: async (user: Partial<User>): Promise<number> => {
    let ifSuccess: number = await Userdb.add(user);
    return ifSuccess;
  },
  deleteUser: async (uid: number): Promise<number> => {
    let ifSuccess: number = await Userdb.delete({
      uid,
    });
    return ifSuccess;
  },
  modifyUser: async (uid: number, partialUser: Partial<User>): Promise<string> => {
    let ifSuccess: string = await Userdb.updateByQuery({
      username: partialUser.username,
      email: partialUser.email,
      phone_number: partialUser.phone_number,
      avatar: partialUser.avatar,
      password: partialUser.password,
      department_id: partialUser.department_id,
      roleIds: partialUser.roleIds,
      update_time: partialUser.update_time,
    }, {
      inFields: {
        uid: [uid],
      },
    });
    return ifSuccess;
  },
  modifyAvatar: async (uid: number, avatar): Promise<string> => {
    let ifSuccess: string = await Userdb.update({
      avatar,
    }, uid);
    return ifSuccess;
  },
};