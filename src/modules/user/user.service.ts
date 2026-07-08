import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./user.interface";
import config from "../../config";

const registerUserIntoDB = async (payload : IRegisterUser) => {
    const { name, email, password, phone, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if (isUserExist) {
        throw new Error("User already exist");
    }

    

    if(role && (role !== "LANDLORD" && role !== "TENANT") ){
        throw new Error("Invalid role, role must be LANDLORD or TENANT");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_value));

    

    const newUser = await prisma.user.create({
        data : {
            name,
            email,
            password : hashedPassword,
            phone,
            role
        }
    })

    const user = await prisma.user.findUnique({
        where : {
            id : newUser.id
        },
        omit : {
            password : true
        }
    })

    return user

}

export const userService = {
    registerUserIntoDB
}