import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const payload = req.body;
    const tenantId = req.user?.id as string;
    const result = await reviewService.createReviewIntoDB(tenantId,payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Review created successfully",
        data: result
    })
    
})

const getAllReviews = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const result = await reviewService.getAllReviewsFromDB();
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews fetched successfully",
        data: result
    })
    
})

export const reviewController = {
    createReview,
    getAllReviews
}