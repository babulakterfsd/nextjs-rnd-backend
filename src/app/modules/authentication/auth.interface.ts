/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type TUserRole = 'admin' | 'user';

export type TDecodedUser = {
  _id: string;
  name: string;
  email: string;
  role: TUserRole;
  iat: number;
  exp: number;
};

//for creating statics
export interface TUserModel extends Model<TUser> {
  isUserExistsWithEmail(email: string): Promise<TUser | null>;
}
