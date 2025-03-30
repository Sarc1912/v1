import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  categoryId: z.number(),
  description: z.string().optional(),
  image: z.string(),
  stock: z.number().min(0),
  slug: z.string()
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string()
});

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;