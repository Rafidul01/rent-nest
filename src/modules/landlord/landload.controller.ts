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
const updateProperty = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const id = req.params.id as string;
    const landloadId = req.user?.id as string;
    const payload = req.body;
    const result = await landlordService.updatePropertyIntoDB(id, landloadId, payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property updated successfully",
        data: result
    })
    
})
const deleteProperty = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const id = req.params.id as string;
    const landloadId = req.user?.id as string;
    const result = await landlordService.deletePropertyFromDB(id, landloadId);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property deleted successfully",
        data: result
    })
    
})

const getRentalRequests = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const landloadId = req.user?.id as string;
    const result = await landlordService.getRentalRequestsFromDB(landloadId);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests fetched successfully",
        data: result
    })
    
})

const updateRentalRequest = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const id = req.params.id as string;
    const landloadId = req.user?.id as string;
    const payload = req.body;
    const result = await landlordService.updateRentalRequestIntoDB(id, landloadId, payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request updated successfully",
        data: result
    })
    
})


export const landlordController = {
    createProperty,
    updateProperty,
    deleteProperty,
    getRentalRequests,
    updateRentalRequest
}