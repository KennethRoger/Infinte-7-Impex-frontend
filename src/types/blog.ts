import { z } from 'zod';

export const BlogSectionSchema = z.object({
  sectionTitle: z.string().optional(),
  description: z.string().min(1, 'Section description is required'),
});

export type BlogSection = z.infer<typeof BlogSectionSchema>;

export const CreateBlogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required and must be under 150 characters')
    .max(150, 'Title is required and must be under 150 characters'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Image must be a valid URL').optional(),
  sections: z
    .array(BlogSectionSchema)
    .min(1, 'At least one section is required'),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

export const UpdateBlogSchema = CreateBlogSchema.partial();
export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;

export const BlogSchema = CreateBlogSchema.extend({
  _id: z.string(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

export type Blog = z.infer<typeof BlogSchema>;

export const BlogSummarySchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.url().optional(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});

export type BlogSummary = z.infer<typeof BlogSummarySchema>;
