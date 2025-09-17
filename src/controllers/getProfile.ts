import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import { ErrorWithStatusCode, JWTAuthenticatedRequest } from "../utils/types";

async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = (req as JWTAuthenticatedRequest).user!;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            const error: ErrorWithStatusCode = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({
            message: "user profile",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
}

export default getProfile;
