import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateCategory } from "./category.interface";
import httpStatus from "http-status";


const createCategoryIntoDB = async (payload : ICreateCategory) => {

    const isCategoryExist = await prisma.category.findUnique({
        where : {
            name : payload.name
        }
    })
    if (isCategoryExist) {
        throw new AppError(httpStatus.CONFLICT, "Category already exist",{
            message : "Category already exist"
        });
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

    if (!categories) {
        throw new AppError(httpStatus.NOT_FOUND, "Categories not found");
    }
    return categories;
}

export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB

}