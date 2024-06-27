import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './auth.controller';
import { loginSchema, signupSchema } from './auth.validation';

const router = express.Router();

router.get('/get-profile', UserControllers.getUserProfile);
router.post('/logout', UserControllers.logoutUser);

router.post(
  '/register',
  validateRequest(signupSchema),
  UserControllers.registerUser,
);

router.post('/login', validateRequest(loginSchema), UserControllers.loginUser);

router.post('/verify-token', UserControllers.verifyToken);

router.post('/refresh-token', UserControllers.getAccessTokenUsingRefreshToken);

export const AuthRoutes = router;
