import { prisma } from "../../lib/prisma";
import { IFilterPayload } from "./property.interface";
import { PropertyWhereInput } from "../../../generated/prisma/models";

const getAllPropertiesFromDB = async (filter: IFilterPayload) => {
    const { city, minPrice, maxPrice, categoryId } = filter;

    const andConditions : PropertyWhereInput[] = [];

    if (city) {
        andConditions.push({
            city: {
                contains: city,
                mode: "insensitive"
            }
        });
    }

    if (minPrice) {
        andConditions.push({
            price: {
                gte: Number(minPrice)
            }
        });
    }

    if (maxPrice) {
        andConditions.push({
            price: {
                lte: Number(maxPrice)
            }
        });
    }

    if (categoryId) {
        andConditions.push({
            categoryId
        });
    }


    const properties = await prisma.property.findMany({
        where: {
            AND: andConditions
        },
        include: {
            category: true,
            landlord: {
                select: { name: true, email: true }
            }
        }
    });

    return properties;
};

const getSinglePropertyFromDB = async (id: string) => {
    const property = await prisma.property.findUnique({
        where: {
            id
        },
        include: {
            category: true,
            landlord: {
                select: { name: true, email: true }
            }
        }
    });
    return property;
};

export const propertyService = {
    getAllPropertiesFromDB,
    getSinglePropertyFromDB
};