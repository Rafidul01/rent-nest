import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser, IUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";


const registerUserIntoDB = async (payload : IRegisterUser) => {
    const { name, email, password, phone, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if (isUserExist) {
        throw new AppError(httpStatus.CONFLICT, "User already exist");
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

const loninUser = async (payload : ILoginUser) => {

    const { email, password } = payload;
    console.log(payload)

    const user = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if(user?.status === "BANNED"){
        throw new Error("User is banned");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
    }

    const jwtPayload = {
        id : user.id,
        email : user.email,
        role : user.role,
        status : user.status,
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt.secret,
        config.jwt.expires_in as SignOptions
    )

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt.refresh_secret,
        config.jwt.refresh_expires_in as SignOptions
    )

    return {
        accessToken,
        refreshToken 
    }

    
}

const getCurrentUserFormDB = async (id : string) => {
    const user = await prisma.user.findUnique({
        where : {
            id
        },
        omit : {
            password : true
        }
    })
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found"); 
    }
    return user;
}



export const authService = {
    loninUser,
    registerUserIntoDB,
    getCurrentUserFormDB
    
}