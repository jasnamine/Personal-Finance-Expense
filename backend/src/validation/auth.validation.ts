import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username cannot exceed 30 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[0-9]/, "Password must contain at least one number"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});
