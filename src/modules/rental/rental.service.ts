import { prisma } from "../../lib/prisma";
import { IRentalRequestPayload } from "./rental.interface";

const createRentalRequestIntoDB = async (tenantId: string, payload: IRentalRequestPayload) => {
    const { propertyId, moveInDate, duration, message } = payload;

    const property = await prisma.property.findUnique({
        where: { id: propertyId }
    });

    if (!property) {
        throw new Error("Property not found");
    }

    if (!property.isAvailable) {
        throw new Error("This property is not currently available for rent");
    }

    if (property.landlordId === tenantId) {
        throw new Error("You cannot submit a rental request for your own property");
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
        throw new Error("You are not authorized to view this rental request");
    }
    return rentalRequest;
};

export const rentalService = {
    createRentalRequestIntoDB,
    getRentalRequestsFromDB,
    getSingleRentalRequestFromDB
};