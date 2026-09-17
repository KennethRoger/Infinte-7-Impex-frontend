import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be between 2 and 50 characters')
    .max(50, 'Name must be between 2 and 50 characters'),
  description: z.string().optional().or(z.literal('')),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

export const CategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  isRemoved: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ProductCategory = z.infer<typeof CategorySchema>;

export interface CategoryFilters {
  name?: string;
}
