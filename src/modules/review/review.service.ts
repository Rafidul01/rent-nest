import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IReviewPayload } from "./review.interface";
import httpStatus from "http-status";

const createReviewIntoDB = async (tenantId : string,payload : IReviewPayload) => {

    const {
        rentalRequestId,
        rating,
        comment
    } = payload
    
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where : {
            id : rentalRequestId
        }
    })

    if (!rentalRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
    }

    if(rentalRequest.tenantId !== tenantId) {
        throw new AppError(httpStatus.NOT_FOUND, "You are not authorized to create a review for this rental request");
    }

    if(rentalRequest.status !== "ACTIVE") {
        throw new AppError(httpStatus.NOT_FOUND, "Rental request is not active, please complite your payment first");
    }
    

    const review = await prisma.review.create({
        data : {
            rentalRequestId,
            rating,
            comment,
            tenantId : rentalRequest.tenantId,
            propertyId : rentalRequest.propertyId
        }
    })

    return review
}

const getAllReviewsFromDB = async () => {

    const reviews = await prisma.review.findMany()

    if (reviews.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "Reviews not found");
    }

    return reviews
}
export const reviewService = {
    createReviewIntoDB,
    getAllReviewsFromDB
}