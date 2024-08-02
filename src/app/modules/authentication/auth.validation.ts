import { z } from 'zod';

export const userSchema = z.object({
  name: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  email: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .min(6, {
      message: 'Password should be at least 6 characters long',
    })
    .max(20, {
      message: 'Password should be at most 20 characters long',
    })
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, {
      message:
        'Password must contain at least one uppercase letter and one numeric character',
    }),
  role: z.enum(['admin', 'user'], {
    invalid_type_error: 'User must be either admin or user',
    required_error: ' is required',
  }),
  profileImage: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
});

export const signupSchema = z.object({
  name: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  email: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  role: z.enum(['admin', 'user'], {
    invalid_type_error: 'User must be either admin or user',
    required_error: ' is required',
  }),
});

export const loginSchema = z.object({
  email: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
});
