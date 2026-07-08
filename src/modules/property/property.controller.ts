import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { propertyService } from "./property.service";



const getAllProperties = catchAsync(async (req: Request, res: Response, next : NextFunction) => {

    const filter = req.query;
    const result = await propertyService.getAllPropertiesFromDB(filter);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties fetched successfully",
        data: result
    })
    
})

const getSingleProperty = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const id = req.params.id as string;
    const result = await propertyService.getSinglePropertyFromDB(id);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property fetched successfully",
        data: result
    })
    
})


export const propertyController = {
    getAllProperties,
    getSingleProperty
}