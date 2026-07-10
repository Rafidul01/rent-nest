import { z } from "zod";

const reviewValidationSchema = z.object({
  rentalRequestId: z.string({ error: "Rental Request ID is required" }),
  rating: z
    .number({ error: "Rating is required and must be a number" })
    .int({ error: "Rating must be a whole number" })
    .min(1, { error: "Rating must be at least 1" })
    .max(5, { error: "Rating cannot be more than 5" }),
  comment: z.string().optional(),
});

export const reviewValidation = {
  reviewValidationSchema,
};
