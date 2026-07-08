export interface IUser {
    id : string;
    name : string;
    email : string;
    password : string;
    phone : string;
    role : string;
    status : string;
    createdAt : Date;
    updatedAt : Date;
}

export interface ILoginUser {
    email : string;
    password : string;
}

export interface IRegisterUser {
    name : string;
    email : string;
    password : string;
    phone? : string;
    role : "LANDLORD" | "TENANT";
}