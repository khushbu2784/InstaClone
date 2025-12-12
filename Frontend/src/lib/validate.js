import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a special character");

// Signup Schema
export const signupSchema = z.object({
  userName: z
    .string({ required_error: "Username is required" })
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .nonempty("Email is required")
    .email("Invalid email address"),

  password: strongPassword,
});

// Login Schema
// export const loginSchema = z.object({
//   email: z
//     .string({ required_error: "Email is required" })
//     .nonempty("Email is required")
//     .email("Invalid email address"),

//   password: strongPassword,
// });
// Login Schema → accepts email OR username
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email or username is required" })
    .nonempty("Email or username is required")
    .refine(
      (value) => {
        // Accept username (no @ symbol, min 3 chars)
        const isUsername = !value.includes("@") && value.length >= 3;

        // Accept valid email
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        return isUsername || isEmail;
      },
      {
        message: "Enter a valid email or username",
      }
    ),

  password: strongPassword,
});



// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Change Password Schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: strongPassword,
});
