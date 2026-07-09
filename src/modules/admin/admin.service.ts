import { prisma } from "../../lib/prisma";
import { IUserPayload } from "./admin.interface";

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: {
            password: true
        }
    });
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

   return user

}

export const adminService = {
    getAllUsersFromDB,
    updateUserIntoDB
}