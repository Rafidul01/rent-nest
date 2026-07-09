import { z } from "zod";

const userUpdateValidationSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(["TENANT", "LANDLORD", "ADMIN"], {
        error: "Role must be either TENANT or LANDLORD or ADMIN",
    }).optional(),
    status: z.enum(["ACTIVE", "BANNED"], {
        error: "Status must be either ACTIVE or BANNED",
    }),
});



export const adminValidation = {
    userUpdateValidationSchema
};