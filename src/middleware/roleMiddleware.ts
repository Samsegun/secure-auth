import { NextFunction, Response } from "express";
import { Role } from "../../generated/prisma";
import { hasPermission } from "../utils/permissionManagement";
import prisma from "../utils/prisma";
import { AuthenticatedRequest, ErrorWithStatusCode } from "../utils/types";

function checkRole(allowedRoles: Role[]) {
    return async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = req.user!;

            const superUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });

            if (!superUser || !hasPermission(superUser.role, allowedRoles)) {
                const error: ErrorWithStatusCode = new Error(
                    "Insufficient permissions"
                );
                error.statusCode = 403;
                throw error;
            }

            // if (!user) {
            //     const error: ErrorWithStatusCode = new Error("User not found");
            //     error.statusCode = 404;
            //     throw error;
            // }

            // if (!allowedRoles.includes(user.role)) {
            //     const error: ErrorWithStatusCode = new Error(
            //         "Insufficient permissions"
            //     );
            //     error.statusCode = 403;
            //     throw error;
            // }

            next();
        } catch (error) {
            next(error);
        }
    };
}

export default checkRole;
