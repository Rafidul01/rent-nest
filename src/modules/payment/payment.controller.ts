import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPayment = catchAsync(async(req: Request, res: Response, next : NextFunction) => {

    const payload = req.body;
    const id = req.user?.id as string;
    const {paymentURL, newTransactionId} = await paymentService.createPayment(id , payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Payment created successfully",
        data: {
            paymentURL,
            newTransactionId
        }
    })
    
})

const confirmPayment = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"]! as string;
    const result = await paymentService.confirmPayment(signature, payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment confirmed successfully",
        data: result
    })
    
})

const getPaymentHistory = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const id = req.user?.id as string;
    const result = await paymentService.getPaymentHistory(id);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history fetched successfully",
        data: result
    })
    
})

const getSinglePayment = catchAsync(async(req: Request, res: Response, next : NextFunction) => {
    const id = req.params.id as string;
    const userId = req.user?.id as string;
    const result = await paymentService.getSinglePayment(id, userId);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history fetched successfully",
        data: result
    })
    
})

export const paymentController = {
    createPayment,
    confirmPayment,
    getPaymentHistory,
    getSinglePayment
}


