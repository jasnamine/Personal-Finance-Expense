import { z } from "zod";

const objectId = z.string();
export const createExpenseSchema = z.object({
  body: z.object({
    description: z
      .string()
      .min(3, "Description must be at least 3 characters long"),
    amount: z.number().positive("Amount must be greater than 0"),
    groupId: objectId,
    paidBy: objectId,
    date: z.string().optional(),
    currency: z.string().optional(),
    splits: z.array(
      z.object({
        userId: objectId,
        value: z.number().nonnegative(),
      }),
    ),
  }),
});

export const expenseIdParamSchema = z.object({
  params: z.object({
    groupId: objectId,
    expenseId: objectId,
  }),
});
