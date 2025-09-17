import { NextFunction, Request, Response } from "express";
import { hasPermission, Permissions } from "../utils/permissionManagement";
import prisma from "../utils/prisma";
import { ErrorWithStatusCode, JWTAuthenticatedRequest } from "../utils/types";

async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = (req as JWTAuthenticatedRequest).user!;

        const superUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                role: true,
            },
        });
        // an extra check for super_admins
        if (
            !superUser ||
            !hasPermission(superUser.role, Permissions.DELETE_USER)
        ) {
            const error: ErrorWithStatusCode = new Error(
                "Insufficient permissions"
            );
            error.statusCode = 403;
            throw error;
        }

        // const userToDelete = await prisma.user.delete({
        //     where: { id: req.params.userId },
        // });
        const userToDelete = "deleted user";
        res.status(200).json({
            message: "user deleted successfully",
            data: {
                userToDelete,
            },
        });
    } catch (error) {
        next(error);
    }
}

export default deleteUser;
