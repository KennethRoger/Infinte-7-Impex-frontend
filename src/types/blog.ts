import { z } from 'zod';

export const BlogSectionSchema = z.object({
  sectionTitle: z.string().optional().or(z.literal('')),
  description: z.string().min(1, 'Section description is required'),
});

export type BlogSection = z.infer<typeof BlogSectionSchema>;

export const CreateBlogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required and must be under 150 characters')
    .max(150, 'Title is required and must be under 150 characters'),
  description: z.string().min(1, 'Main description is required'),
  image: z.url('Image must be a valid URL').optional().or(z.literal('')),
  sections: z
    .array(BlogSectionSchema)
    .min(1, 'At least one section is required')
    .max(5, 'A blog can have a maximum of 5 sections'),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

export const UpdateBlogSchema = CreateBlogSchema.partial();
export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;

export interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: string;
  sections: BlogSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogSummary {
  _id: string;
  title: string;
  description: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogFilters {
  title?: string;
}
