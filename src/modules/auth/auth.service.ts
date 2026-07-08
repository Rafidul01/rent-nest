import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IUser } from "./auth.interface";

const loninUser = async (payload : ILoginUser) => {

    const { email, password } = payload;
    console.log(payload)

    const user = await prisma.user.findUnique({
        where : {
            email
        }
    })

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if(user?.status === "BANNED"){
        throw new Error("User is banned");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new Error("Invalid password");
    }

    return user

    
}



export const authService = {
    loninUser,
    
}