import { z } from "zod";

export const signupSchema = z.object({
  userName: z
    .string({ required_error: "Username is required" })
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .nonempty("Email is required")
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .nonempty("Email is required")
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),

});
