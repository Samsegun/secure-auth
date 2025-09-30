import { NextFunction, Request, Response } from "express";
import { JWTAuthenticatedRequest } from "../utils/types";

async function checkAuthStatus(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // check for JWT auth
        if ((req as JWTAuthenticatedRequest).user) {
            const { userId, role, isVerified } = (
                req as JWTAuthenticatedRequest
            ).user!;
            return res.status(200).json({
                success: true,
                isAuthenticated: true,
                authMethod: "jwt",
                user: { userId, role, isVerified },
            });
        }

        // check for OAuth
        if (req.isAuthenticated && req.isAuthenticated()) {
            const user = req.user as any;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    isAuthenticated: false,
                    message: "No user data found",
                });
            }

            return res.status(200).json({
                success: true,
                isAuthenticated: true,
                authMethod: "oauth",
                user: {
                    userId: user.id,
                    role: user.role,
                    isVerified: true, // OAuth users are pre-verified
                },
            });
        }

        // No valid authentication found
        return res.status(401).json({
            success: false,
            isAuthenticated: false,
            message: "Not authenticated",
        });
    } catch (error) {
        console.error("Check auth status error:", error);
        next(error);
    }
}

export default checkAuthStatus;
