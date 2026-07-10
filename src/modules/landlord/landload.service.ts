import { prisma } from "../../lib/prisma";
import { IPropertyPayload, IRentalRequestPayload } from "./landload.interface";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

const createPropertyIntoDB  = async (userId : string, payload : IPropertyPayload) => {

    const category = await prisma.category.findUnique({
        where : {
            id : payload.categoryId
        }
    })

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    const property = await prisma.property.create({
        data : {
            ...payload,
            landlordId : userId
        }
    })

    return property
    
}

const updatePropertyIntoDB = async (id : string, landloadId : string, payload : IPropertyPayload) => {

    const property = await prisma.property.findUnique({
        where : {
            id
        }
    })

    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }

    if (property.landlordId !== landloadId) {
        throw new AppError(httpStatus.NOT_FOUND, "You are not authorized to update this property");
    }

    const Updatedproperty = await prisma.property.update({
        where : {
            id
        },
        data : {
            ...payload
        }
    })

    return Updatedproperty
    
}

const deletePropertyFromDB = async (id : string, landloadId : string) => {

    const property = await prisma.property.findUnique({
        where : {
            id
        }
    })

    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }

    if (property.landlordId !== landloadId) {
        throw new AppError(httpStatus.NOT_FOUND, "You are not authorized to delete this property");
    }

    const deletedProperty = await prisma.property.delete({
        where : {
            id
        }
    })

    return deletedProperty
    
}

const getRentalRequestsFromDB = async (landloadId : string) => {

    const rentalRequests = await prisma.rentalRequest.findMany({
        where : {
            property : {
                landlordId : landloadId
            }
        }
    })
    if (rentalRequests.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental requests not found");
    }

    return rentalRequests
}

const updateRentalRequestIntoDB = async (id : string, landloadId : string, payload : IRentalRequestPayload) => {

    const {
        status
    } = payload

    const rentalRequest = await prisma.rentalRequest.findUnique({
        where : {
            id
        },
        include : {
            property : true
        }
    })

    if (!rentalRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
    }

    if (rentalRequest.property.landlordId !== landloadId) {
        throw new AppError(httpStatus.NOT_FOUND, "You are not authorized to update this rental request");
    }

    const updatedRentalRequest = await prisma.rentalRequest.update({
        where : {
            id
        },
        data : {
            status
        }
    })

    return updatedRentalRequest
}

export const landlordService = {
    createPropertyIntoDB,
    updatePropertyIntoDB,
    deletePropertyFromDB,
    getRentalRequestsFromDB,
    updateRentalRequestIntoDB
}