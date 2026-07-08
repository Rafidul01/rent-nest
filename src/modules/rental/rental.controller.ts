import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { rentalService } from "./rental.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const payload = req.body;
    const tenantId = req.user?.id as string;
    const result = await rentalService.createRentalRequestIntoDB(tenantId , payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental request created successfully",
        data: result
    })
    
})

const getRentalRequests = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const tenantId = req.user?.id as string;
    const result = await rentalService.getRentalRequestsFromDB(tenantId);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests fetched successfully",
        data: result
    })
})

const getSingleRentalRequest = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const id = req.params.id as string;
    const tenantId = req.user?.id as string;
    const result = await rentalService.getSingleRentalRequestFromDB(id, tenantId);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request fetched successfully",
        data: result
    })
    
})



export const rentalController = {
    createRentalRequest,
    getRentalRequests,
    getSingleRentalRequest
}
