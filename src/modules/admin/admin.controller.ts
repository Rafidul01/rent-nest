import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async(req: Request, res: Response, next : NextFunction) => {

    const result = await adminService.getAllUsersFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users fetched successfully",
        data: result
    })


})

const updateUser = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const id = req.params.id as string;
    const payload = req.body;

    const result = await adminService.updateUserIntoDB(id,payload)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: result
    })
})

const getRentalRequests = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const result = await adminService.getRentalRequestsFromDB();
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests fetched successfully",
        data: result
    })
    
})

export const adminController = {
    getAllUsers,
    updateUser,
    getRentalRequests
}