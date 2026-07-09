import { z } from "zod";


const createPropertyValidationSchema = z.object({
    
     title: z.string({ error: "Title is required" }).min(2, "Title must be at least 2 characters"),
     description: z.string({ error: "Description is required" }).min(2, "Description must be at least 2 characters"),
     address: z.string({ error: "Address is required" }).min(2, "Address must be at least 2 characters"),
     city: z.string({ error: "City is required" }).min(2, "City must be at least 2 characters"),
     price: z.number({ error: "Price is required and must be a number" }),
     bedrooms: z.number({ error: "Bedrooms is required and must be a number" }).optional(),
     bathrooms: z.number({ error: "Bathrooms is required and must be a number" }).optional(),
     areaSqft: z.number({ error: "Area is required and must be a number" }).optional(),
     amenities: z.array(z.string()).optional(),
     images: z.array(z.string()).optional(),
     categoryId: z.string({ error: "Category is required" }),
     isAvailable: z.boolean().optional(),
});

const updatePropertyValidationSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    price: z.number({ error: "Price must be a number" }).optional(),
    bedrooms: z.number({ error: "Bedrooms must be a number" }).optional(),
    bathrooms: z.number({ error: "Bathrooms must be a number" }).optional(),
    areaSqft: z.number({ error: "Area must be a number" }).optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    isAvailable: z.boolean().optional(),
});

const statusUpdateValidationSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
        error: "Status must be either APPROVED or REJECTED",
    })
})


export const landlordValidation = {
    createPropertyValidationSchema,
    statusUpdateValidationSchema,
    updatePropertyValidationSchema
};