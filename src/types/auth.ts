import { z } from 'zod';

export const LoginCredentialsSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const AuthTokenSchema = z.object({
  token: z.string().min(1),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;
