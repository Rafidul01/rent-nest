import { prisma } from "../../lib/prisma";
import { IRentalRequestPayload } from "./rental.interface";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

const createRentalRequestIntoDB = async (tenantId: string, payload: IRentalRequestPayload) => {
    const { propertyId, moveInDate, duration, message } = payload;

    const property = await prisma.property.findUnique({
        where: { id: propertyId }
    });

    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }

    if (!property.isAvailable) {
        throw new AppError(httpStatus.NOT_FOUND, "Property is not available");
    }

    if (property.landlordId === tenantId) {
        throw new AppError(httpStatus.NOT_FOUND, "You cannot rent your own property");
    }

    const totalAmount = property.price * duration;

    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId,
            moveInDate: new Date(moveInDate),
            durationMonths: duration,
            totalAmount,
            message
        }
    });

    return rentalRequest;
};

const getRentalRequestsFromDB = async (tenantId: string) => {

    const rentalRequests = await prisma.rentalRequest.findMany({
        where: {
            tenantId
        }
    });

    if (rentalRequests.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental requests not found");
        
    }
    return rentalRequests;
};

const getSingleRentalRequestFromDB = async (id: string, tenantId: string) => {


    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id
        },
        include: {
            property: true

        }
    });
    if (rentalRequest?.tenantId !== tenantId) {
        throw new AppError(httpStatus.NOT_FOUND, "You are not authorized to view this rental request");
    }
    return rentalRequest;
};

export const rentalService = {
    createRentalRequestIntoDB,
    getRentalRequestsFromDB,
    getSingleRentalRequestFromDB
};