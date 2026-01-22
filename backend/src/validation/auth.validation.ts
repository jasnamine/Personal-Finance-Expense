import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    username: z.string().min(3, "Username tối thiểu 3 ký tự"),
    password: z.string().min(6, "Password tối thiểu 6 ký tự"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Password tối thiểu 6 ký tự"),
  }),
});
