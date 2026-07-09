import { z } from "zod";

const createValidationSchema = z.object({
    name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
     
});


export const categoryValidation = {
    createValidationSchema
};