import { Role, UserStatus } from "../../../generated/prisma/client";

export interface IUserPayload{
    name? : string;
    email? : string;
    phone? : string;
    role? : Role;
    status : UserStatus;
}