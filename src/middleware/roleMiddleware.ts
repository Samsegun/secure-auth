import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma";
import { hasPermission } from "../utils/permissionManagement";
import prisma from "../utils/prisma";
import { ErrorWithStatusCode, JWTAuthenticatedRequest } from "../utils/types";

function checkRole(allowedRoles: Role[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = (req as JWTAuthenticatedRequest).user!;

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

            next();
        } catch (error) {
            next(error);
        }
    };
}

export default checkRole;
