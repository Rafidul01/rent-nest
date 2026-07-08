import { prisma } from "../../lib/prisma";
import { ICreateProperty } from "./landload.interface";

const createPropertyIntoDB  = async (userId : string, payload : ICreateProperty) => {

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

export const landlordService = {
    createPropertyIntoDB
}