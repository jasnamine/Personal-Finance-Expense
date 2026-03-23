import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username cannot exceed 30 characters")
        .trim()
        .optional(),
      currency: z
        .string()
        .min(1, "Currency code is required if provided")
        .optional(),
    })
    .refine((data) => data.username || data.currency, {
      message: "At least one field must be provided for update",
    }),
});
