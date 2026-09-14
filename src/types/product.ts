import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  images: z
    .array(z.url('Image must be a valid URL'))
    .min(1, 'At least one image is required'),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Category must be a valid category ID'),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

export const ProductSchema = CreateProductSchema.extend({
  _id: z.string(),
  isRemoved: z.boolean().default(false),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const PopulatedCategoryRefSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const PopulatedProductSchema = ProductSchema.extend({
  category: PopulatedCategoryRefSchema,
});

export type PopulatedProduct = z.infer<typeof PopulatedProductSchema>;
