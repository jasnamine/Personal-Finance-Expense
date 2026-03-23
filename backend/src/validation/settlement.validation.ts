import { z } from "zod";

const objectId = z.string();

export const settleDebtSchema = z.object({
  params: z.object({
    groupId: objectId,
  }),
  body: z
    .object({
      fromUserId: objectId,
      toUserId: objectId,
      amount: z.number().positive("Payment amount must be greater than 0"),
      method: z.enum(["cash", "bank", "momo", "zalopay", "other"], {
        errorMap: () => ({
          message: "Payment method must be cash, bank, momo, zalopay, or other",
        }),
      }),
    })
    .refine((data) => data.fromUserId !== data.toUserId, {
      message: "Sender and receiver cannot be the same person",
      path: ["toUserId"],
    }),
});

export const getSettlementParamSchema = z.object({
  params: z.object({
    groupId: objectId,
  }),
});
