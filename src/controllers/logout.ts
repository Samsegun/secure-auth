import { NextFunction, Response } from "express";
import { baseCookieOptions } from "../config/auth";
import prisma from "../utils/prisma";
import { AuthenticatedRequest } from "../utils/types";

async function logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        /**
         * 'Refresh not sent from client'
         * to be revised later due to path value on
         *  refreshTokenCookieOptions in src/config/auth.ts
         */
        // const { refreshToken } = req.cookies;

        // // if refresh token exists, remove it from database
        // if (refreshToken) {
        //     try {
        //         const decoded = verifyRefreshToken(refreshToken);
        //         await prisma.refreshToken.deleteMany({
        //             where: {
        //                 userId: decoded.userId,
        //                 token: refreshToken,
        //             },
        //         });
        //     } catch (error) {
        //         // token might be invalid, but we still want to clear cookies
        //         console.log(
        //             "Error verifying refresh token during logout:",
        //             error
        //         );
        //     }
        // }

        // this will logout on all devices
        await prisma.refreshToken.deleteMany({
            where: {
                userId: req.user!.userId,
            },
        });

        // clear cookies
        res.clearCookie("accessToken", { ...baseCookieOptions, maxAge: 0 });
        res.clearCookie("refreshToken", {
            ...baseCookieOptions,
            path: "/api/auth/refresh",
            maxAge: 0,
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

export default logout;
