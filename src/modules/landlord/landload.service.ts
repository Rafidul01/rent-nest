import { prisma } from "../../lib/prisma";
import { IPropertyPayload } from "./landload.interface";

const createPropertyIntoDB  = async (userId : string, payload : IPropertyPayload) => {

    const category = await prisma.category.findUnique({
        where : {
            id : payload.categoryId
        }
    })

    if (!category) {
        throw new Error("Invalid category, please select a valid category");
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
        throw new Error("Property not found");
    }

    if (property.landlordId !== landloadId) {
        throw new Error("You are not authorized to update this property");
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
        throw new Error("Property not found");
    }

    if (property.landlordId !== landloadId) {
        throw new Error("You are not authorized to delete this property");
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

    return rentalRequests
}

export const landlordService = {
    createPropertyIntoDB,
    updatePropertyIntoDB,
    deletePropertyFromDB,
    getRentalRequestsFromDB
}