import z from "zod";

export const userSignInSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must be at least 8 characters long and contain at least one letter, one number and one special character",
    ),
});

export const userSignUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
    ),
});

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .optional(),
  email: z.email({ error: "Invalid email address" }).optional(),
});

export const userAddressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
});

export const userPasswordResetSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
});

export const userContactNumberSchema = z.object({
  contactNumber: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Invalid contact number. It should be in E.164 format.",
    ),
});
