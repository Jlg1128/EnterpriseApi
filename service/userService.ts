/* eslint-disable max-len */
import UserDao from '../dao/userDao';
import { User } from '../domain/user';

const userService = {
  getUserById: async (uid: number) => {
    let user = await UserDao.getUserById(uid);
    return user;
  },
  getUserByNickname: async (username: string) => {
    let user = await UserDao.getUserByNickname(username);
    return user;
  },
  getUserByEmail: async (email: string) => {
    let user = await UserDao.getUserByEmail(email);
    return user;
  },
  getUserByPhoneNumber: async (phoneNumber: string) => {
    let user = await UserDao.getUserByPhoneNumber(phoneNumber);
    return user;
  },
  // getAllUsers: async () => {
  //   let users = await UserDao.getAllUsers();
  //   return users;
  // },
  insertUser: async (user: Partial<User>): Promise<number> => {
    let ifSuccess: number = await UserDao.insertUser(user);
    return ifSuccess;
  },
  deleteUser: async (uid: number): Promise<number> => {
    let ifSuccess: number = await UserDao.deleteUser(uid);
    return ifSuccess;
  },
  modifyUser: async (uid: number, partialUser: Partial<User>): Promise<string> => {
    let user: string = await UserDao.modifyUser(uid, partialUser);
    return user;
  },
  modifyAvatar: async (uid: number, avatar): Promise<string> => {
    let ifSuccess: string = await UserDao.modifyAvatar(uid, avatar);
    return ifSuccess;
  },
};

export default userService;