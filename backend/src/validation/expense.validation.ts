import { z } from "zod";

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().optional(),
    date: z.string(),
    description: z.string().optional(),
    type: z.enum(["income", "expense"]),
    categoryId: z.string().optional(),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    amount: z.number().optional(),
    currency: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(["income", "expense"]).optional(),
    categoryId: z.string().optional(),
  }),
});

export const expenseQuerySchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    category: z.string().optional(),
    minAmount: z.string().optional(),
    maxAmount: z.string().optional(),
  }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    expenseId: z.string().min(1),
  }),
});