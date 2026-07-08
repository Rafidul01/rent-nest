import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { propertyService } from "./property.service";



const getAllProperties = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const result = await propertyService.getAllPropertiesFromDB();
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties fetched successfully",
        data: result
    })
    
})


export const propertyController = {
    getAllProperties
}