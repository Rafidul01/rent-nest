import { prisma } from "../../lib/prisma";

const getAllPropertiesFromDB = async () => {
    const properties = await prisma.property.findMany();
    return properties
}
export const propertyService = {
    getAllPropertiesFromDB
};