import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const payload = req.body;
    const result = await userService.registerUserIntoDB(payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User registered successfully",
        data: result
    })
})

export const userController = {
    registerUser,
}