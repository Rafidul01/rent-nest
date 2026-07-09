
import { z } from "zod";

const registerValidationSchema = z.object({
    name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters"),
    email: z.string({ error: "Email is required" }).email("Invalid email address"),
    password: z.string({ error: "Password is required" }).min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    role: z.enum(["TENANT", "LANDLORD"], {
        error: "Role must be either TENANT or LANDLORD",
    }),
});

const loginValidationSchema = z.object({
    email: z.string({ error: "Email is required" }).email("Invalid email address"),
    password: z.string({ error: "Password is required" }),
});

export const authValidation = {
    registerValidationSchema,
    loginValidationSchema,
};