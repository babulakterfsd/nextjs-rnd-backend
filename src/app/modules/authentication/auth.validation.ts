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
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
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
