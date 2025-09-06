import { NextFunction, Response } from "express";
import { baseCookieOptions } from "../config/auth";
import prisma from "../utils/prisma";
import { verifyRefreshToken } from "../utils/tokenManagement";
import { AuthenticatedRequest } from "../utils/types";

async function logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { refreshToken } = req.cookies;

        // if refresh token exists, remove it from database
        if (refreshToken) {
            try {
                const decoded = verifyRefreshToken(refreshToken);
                await prisma.refreshToken.deleteMany({
                    where: {
                        userId: decoded.userId,
                        token: refreshToken,
                    },
                });
            } catch (error) {
                // token might be invalid, but we still want to clear cookies
                console.log(
                    "Error verifying refresh token during logout:",
                    error
                );
            }
        }

        // clear cookies
        res.clearCookie("accessToken", { ...baseCookieOptions, maxAge: 0 });
        res.clearCookie("refreshToken", { ...baseCookieOptions, maxAge: 0 });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

export default logout;
