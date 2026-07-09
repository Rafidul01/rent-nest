import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error : ", err);

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = err.message || "Something went wrong";
    let errorDetails: unknown = null;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errorDetails;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.CONFLICT;
            message = `A record with this ${(err.meta?.target as string[])?.join(", ") || "value"} already exists`;
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            message = "The requested record was not found";
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Invalid reference to a related record";
        } else {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Database request error";
        }
        errorDetails = err.meta ?? null;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
        ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    });
};