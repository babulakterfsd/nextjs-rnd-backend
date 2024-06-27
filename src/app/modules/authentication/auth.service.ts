/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';

import { TUser } from './auth.interface';
import { UserModel } from './auth.model';

//create user in DB
const registerUserInDB = async (user: TUser) => {
  const isUserExistsWithEmail = await UserModel.isUserExistsWithEmail(
    user?.email,
  );

  if (isUserExistsWithEmail) {
    throw new Error(
      'User with this email already exists, please try with different  email.',
    );
  } else {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // transaction - 1
      const newUser = await UserModel.create([user], {
        session,
      });

      await session.commitTransaction();
      await session.endSession();

      if (newUser.length < 1) {
        throw new Error('Registration failed !');
      }

      return newUser[0];
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }
  }
};

// login suser in DB
const loginUserInDB = async (user: TUser) => {
  const userFromDB = await UserModel.isUserExistsWithEmail(user?.email);
  if (!userFromDB) {
    throw new Error('No user found with this email');
  }
  const isPasswordMatched = await bcrypt.compare(
    user?.password,
    userFromDB.password,
  );
  if (!isPasswordMatched) {
    throw new Error('Incorrect password');
  }

  //create token and send it to client side
  const payload = {
    _id: userFromDB?._id,
    name: userFromDB?.name,
    email: userFromDB?.email,
    role: userFromDB?.role,
  };

  const accesstoken = jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  const refreshfToken = jwt.sign(payload, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in,
  });

  return {
    accesstoken,
    refreshfToken,
    userFromDB,
  };
};

//verify token from client side
const verifyToken = async (token: string) => {
  if (!token) {
    return false;
  }

  // checking token is valid or not
  let decodedUser: JwtPayload | string;

  try {
    decodedUser = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error) {
    return false;
  }

  const { email } = decodedUser as JwtPayload;

  // checking if the user exists
  const user = await UserModel.isUserExistsWithEmail(email);

  if (!user) {
    return false;
  }

  return true;
};

//generate refresh token
const getAccessTokenByRefreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token is required');
  }

  // checking token is valid or not
  let decodedUser: JwtPayload | string;

  try {
    decodedUser = jwt.verify(
      token as string,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new JsonWebTokenError('Unauthorized Access!');
  }

  const { _id, name, role, email } = decodedUser as JwtPayload;

  // checking if the user exists
  const user = await UserModel.isUserExistsWithEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Unauthorized Access!');
  }

  const payload = {
    _id,
    name,
    role,
    email,
  };

  const accessToken = jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  return {
    accessToken,
  };
};

// get user by email
const getuserFromDBByEmail = async (email: string) => {
  if (!email) {
    throw new Error('Email is required');
  } else {
    const userFromDB = await UserModel.findOne({
      email,
    });
    const modifiedUser = {
      _id: userFromDB?._id,
      name: userFromDB?.name,
      email: userFromDB?.email,
      role: userFromDB?.role,
      profileImage: userFromDB?.profileImage,
    };

    return modifiedUser;
  }
};

//logout user from db
const logoutUserInDB = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required');
  }

  // checking token is valid or not
  let decodedUser: JwtPayload | string;

  try {
    decodedUser = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new JsonWebTokenError('Unauthorized Access!');
  }
  const { email } = decodedUser as JwtPayload;

  // checking if the user exists
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Unauthorized Access!');
  }

  return true;
};

export const UserServices = {
  registerUserInDB,
  loginUserInDB,
  verifyToken,
  getAccessTokenByRefreshToken,
  getuserFromDBByEmail,
  logoutUserInDB,
};
