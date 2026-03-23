import { z } from "zod";

export const getBalancesSchema = z.object({
  params: z.object({
    groupId: z.string(),
  }),
});
