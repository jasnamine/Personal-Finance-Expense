import { z } from "zod";

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    baseCurrency: z.string().optional(),
  }),
});

export const groupIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const deleteGroupSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});