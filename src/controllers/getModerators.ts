import { NextFunction, Response } from "express";
import prisma from "../utils/prisma";
import { AuthenticatedRequest, ErrorWithStatusCode } from "../utils/types";

async function getModerators(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { userId } = req.user!;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            const error: ErrorWithStatusCode = new Error("invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({
            message: "this is going to be a list of moderators",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
}

export default getModerators;
