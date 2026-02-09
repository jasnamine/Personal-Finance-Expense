import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["INCOME", "EXPENSE"]),
    icon: z.string().min(1, "Icon is required"),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1),
    type: z.enum(["INCOME", "EXPENSE"]),
    icon: z.string().min(1),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().min(1),
  }),
});
