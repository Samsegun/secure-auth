import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { verifyAccessToken } from "../utils/tokenManagement";
import { ErrorWithStatusCode, JWTAuthenticatedRequest } from "../utils/types";

async function authenticateUserToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            const error: ErrorWithStatusCode = new Error(
                "Access token not found"
            );
            error.statusCode = 401;
            throw error;
        }

        // expired access tokens will fail here
        const decoded = verifyAccessToken(accessToken);

        // verify user still exists and is verified
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, isVerified: true },
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

        (req as JWTAuthenticatedRequest).user = {
            userId: user.id,
            // email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "access token expired",
                code: "TOKEN_EXPIRED",
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "invalid access token",
            });
        }

        next(error);
    }
}

export { authenticateUserToken };
