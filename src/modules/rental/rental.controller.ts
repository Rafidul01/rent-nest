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



export const rentalController = {
    createRentalRequest
}
