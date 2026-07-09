import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";

export const validateRequest = (schema: ZodType<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errorDetails = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            return next(
                new AppError(httpStatus.BAD_REQUEST, "Validation failed", errorDetails)
            );
        }

        req.body = result.data;
        next();
    };
};