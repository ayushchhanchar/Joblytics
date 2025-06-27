import { z } from "zod";

const nameRegex = /^[A-Za-z\s]+$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .regex(nameRegex, "Name must contain only letters and spaces"),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(
      strongPasswordRegex,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
});
export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(
      strongPasswordRegex,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
});
export type RegisterInput = z.infer<typeof registerSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
