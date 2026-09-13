import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be between 2 and 50 characters')
    .max(50, 'Name must be between 2 and 50 characters'),
  description: z.string().optional(),
  image: z.string().url('Image must be a valid URL').optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

export const CategorySchema = CreateCategorySchema.extend({
  _id: z.string(),
  isRemoved: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type ProductCategory = z.infer<typeof CategorySchema>;
