import { z } from 'zod';

export const CustomerPriorityEnum = z.enum(['high', 'medium', 'low', 'unset']);
export type CustomerPriority = z.infer<typeof CustomerPriorityEnum>;

export const CreateCustomerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(20, 'Name cannot exceed 20 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  message: z.string().min(1, 'Message is required'),
});

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;

export const CustomerSchema = CreateCustomerSchema.extend({
  _id: z.string(),
  priority: CustomerPriorityEnum.default('unset'),
  isActive: z.boolean().default(true),
  notes: z.string().default(''),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;
