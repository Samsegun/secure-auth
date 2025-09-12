import { NextFunction, Response } from "express";
import prisma from "../utils/prisma";
import { AuthenticatedRequest, ErrorWithStatusCode } from "../utils/types";

async function getUsers(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const users = await prisma.user.findMany({
            take: 10,
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        if (!users.length) {
            const error: ErrorWithStatusCode = new Error("No users found");
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({
            message: "users fetched successfully",
            data: {
                users,
            },
        });
    } catch (error) {
        next(error);
    }
}

export default getUsers;
