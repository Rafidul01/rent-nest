import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { landlordService } from "./landload.service";
import httpStatus from "http-status";

const createProperty = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;
    const result = await landlordService.createPropertyIntoDB(userId, payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property created successfully",
        data: result
    })
    
})


export const landlordController = {
    createProperty
}