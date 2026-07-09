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

export const paymentController = {
    createPayment
}


