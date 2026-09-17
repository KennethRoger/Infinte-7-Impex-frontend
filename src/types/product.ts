import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional().or(z.literal('')),
  images: z
    .array(z.url('Image must be a valid URL'))
    .min(1, 'At least one product image is required')
    .max(4, 'Maximum 4 images allowed per product'),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Category must be a valid category ID'),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

export const PopulatedCategoryRefSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export type PopulatedCategoryRef = z.infer<typeof PopulatedCategoryRefSchema>;

export interface PopulatedProduct {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  category: PopulatedCategoryRef;
  isRemoved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  name?: string;
}
