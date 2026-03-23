import { z } from "zod";

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be a positive number"),
    currency: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category ID is required"),
  }),
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Expense ID is required"),
  }),
  body: z.object({
    amount: z.number().positive("Amount must be a positive number").optional(),
    currency: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
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
    expenseId: z.string(),
  }),
});