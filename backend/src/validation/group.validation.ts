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
    groupId: z.string(),
  }),
});

export const deleteGroupSchema = z.object({
  params: z.object({
    groupId: z.string(),
  }),
});

export const updateGroupSchema = z.object({
  params: z.object({
    groupId: z.string(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    baseCurrency: z.string().optional(),
  }),
});