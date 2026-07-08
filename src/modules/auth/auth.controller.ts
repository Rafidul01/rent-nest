import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const registerUser = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const payload = req.body;
    const result = await authService.registerUserIntoDB(payload);
    
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User registered successfully",
        data: result
    })

})

const loginUser = catchAsync(async (req: Request, res: Response, next : NextFunction) => {

    const payload = req.body;
    const {accessToken, refreshToken} = await authService.loninUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken
        }
    })
    
    
})

const getCurrentUser = catchAsync(async (req: Request, res: Response, next : NextFunction) => {

    const id = req.user?.id as string;

    const user = await authService.getCurrentUserFormDB(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User fetched successfully",
        data: user
    })
    
})



export const authController = {
    loginUser,
    registerUser,
    getCurrentUser
}