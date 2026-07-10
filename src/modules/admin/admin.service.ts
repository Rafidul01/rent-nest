import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IUserPayload } from "./admin.interface";

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: {
            password: true
        }
    });
    if (!users) {
        throw new AppError(404, "Users not found");
        
    }
    return users;
}

const updateUserIntoDB = async (id: string, payload : IUserPayload) =>{

   const user = await prisma.user.update({
    where : {
        id
    },
    data : {
        ...payload
    }
   })
   if (!user) {
    throw new AppError(404, "User not found");
   }

   return user

}
const getRentalRequestsFromDB = async () => {

    const rentalRequests = await prisma.rentalRequest.findMany();
    return rentalRequests;
};

export const adminService = {
    getAllUsersFromDB,
    updateUserIntoDB,
    getRentalRequestsFromDB
}