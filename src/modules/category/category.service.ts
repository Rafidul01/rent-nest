import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";


const createCategoryIntoDB = async (payload : ICreateCategory) => {

    const isCategoryExist = await prisma.category.findUnique({
        where : {
            name : payload.name
        }
    })
    if (isCategoryExist) {
        throw new Error("Category already exist");
    }

    const category = await prisma.category.create({
        data : {
            name : payload.name,
            description : payload.description
        }
    })

    return category

}

const getAllCategoriesFromDB = async () => {
    const categories = await prisma.category.findMany();
    return categories;
}

export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB

}