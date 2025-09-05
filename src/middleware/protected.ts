import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { verifyAccessToken } from "../utils/tokenManagement";
import {
    AuthenticatedRequest,
    ErrorWithStatusCode,
    JwtPayload,
    ValidationError,
} from "../utils/types";

function authRequired(req: Request, res: Response, next: NextFunction) {
    try {
        const bearer = req.headers.authorization;

        if (!bearer) {
            const error: ValidationError = new Error("Not Authorized!");
            error.statusCode = 401;
            throw error;
        }

        const token = bearer.split(" ")[1];
        if (!token) {
            const error: ValidationError = new Error("No valid token!");
            error!.statusCode = 401;
            throw error;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is not defined in the environment variables"
            );
        }

        const user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        req.userId = user.userId;

        next();
    } catch (error) {
        next(error);
    }
}

async function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.cookies.accessToken as string;
        if (!accessToken) {
            const error: ErrorWithStatusCode = new Error(
                "Access token not found"
            );
            error.statusCode = 400;
            throw error;
        }

        const decoded = verifyAccessToken(accessToken);

        // verify user still exists and is verified
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, isVerified: true },
        });
        if (!user) {
            const error: ErrorWithStatusCode = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        if (!user.isVerified) {
            const error: ErrorWithStatusCode = new Error("Email not verified");
            error.statusCode = 403;
            throw error;
        }

        req.user = {
            userId: user.id,
            email: user.email,
            isVerified: user.isVerified,
        };

        next();
    } catch (error) {
        next(error);
    }
}

export { authenticateToken, authRequired };
