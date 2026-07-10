import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/AppError";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization?.split(" ")[1]
            : req.headers.authorization;

        if (!token) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "You are not logged in. Please log in to access this resource."
            );
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt.secret);

        if (!verifiedToken.success) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                verifiedToken.message || "Invalid or expired token."
            );
        }

        const { id, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "Forbidden. You don't have permission to access this resource.",
                {
                    requiredRoles,
                    yourRole: role,
                }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                "User not found. Please log in again."
            );
        }

        if (user.status === "BANNED") {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "Your account has been banned. Please contact support.",
                { status: user.status }
            );
        }

        req.user = {
            email: user.email,
            name: user.name,
            id: user.id,
            role: user.role
        };

        next();
    });
};