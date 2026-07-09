import { z } from "zod";


const createRentalValidationSchema = z.object({
    propertyId: z.string({ error: "Property ID is required" }),
    moveInDate: z.iso.date({ error: "Move in date must be in YYYY-MM-DD format" }),
    duration: z.number({ error: "Duration is required and must be a number" }),
    message: z.string().optional(),
    
})



export const rentalValidation = {
    createRentalValidationSchema
   
};