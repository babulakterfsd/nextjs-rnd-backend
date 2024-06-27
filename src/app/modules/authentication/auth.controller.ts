import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TDecodedUser } from './auth.interface';
import { UserServices } from './auth.service';

//create user
const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User has been registered succesfully',
    data: result,
  });
});

//login user
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUserInDB(req.body);
  const { accesstoken, refreshfToken, userFromDB } = result;

  res.cookie('refreshfToken', refreshfToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been logged in succesfully',
    data: {
      user: {
        _id: userFromDB?._id,
        name: userFromDB?.name,
        email: userFromDB?.email,
        role: userFromDB?.role,
      },
      token: accesstoken,
    },
  });
});

// verify token from client side
const verifyToken = catchAsync(async (req, res) => {
  const result = await UserServices.verifyToken(req.body.token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token verification completed!',
    data: result,
  });
});

//get access token using refresh token
const getAccessTokenUsingRefreshToken = catchAsync(async (req, res) => {
  const result = await UserServices.getAccessTokenByRefreshToken(
    req.cookies?.refreshfToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved succesfully!',
    data: result,
  });
});

// get user profile
const getUserProfile = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const { email } = decodedUser as TDecodedUser;

  const result = await UserServices.getuserFromDBByEmail(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile has been retrieved succesfully',
    data: result,
  });
});

// logout user
const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie('refreshfToken', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully!',
    data: null,
  });
});

export const UserControllers = {
  registerUser,
  loginUser,
  verifyToken,
  getAccessTokenUsingRefreshToken,
  getUserProfile,
  logoutUser,
};
