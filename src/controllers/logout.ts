import { NextFunction, Request, Response } from "express";
import { baseCookieOptions } from "../config/auth";
import { promisifyLogout, promisifySessionDestroy } from "../utils/logoutUtils";
import prisma from "../utils/prisma";
import { JWTAuthenticatedRequest } from "../utils/types";

// logout works for both customAuth and oauth users
async function unifiedLogout(req: Request, res: Response, next: NextFunction) {
    try {
        let tokensCleared = false;
        let oauthLoggedOut = false;

        // clear jwt tokens from db
        if (req.cookies.accessToken && (req as JWTAuthenticatedRequest).user) {
            const { userId } = (req as JWTAuthenticatedRequest).user!;

            await prisma.refreshToken.deleteMany({
                where: { userId },
            });

            tokensCleared = true;
        }

        // clear custom auth tokens
        res.clearCookie("accessToken", { ...baseCookieOptions, maxAge: 0 });
        res.clearCookie("refreshToken", {
            ...baseCookieOptions,
            path: "/api/auth/refresh",
            maxAge: 0,
        });

        // handle oauth logout
        if (req.session && req.isAuthenticated && req.isAuthenticated()) {
            // logout and destroy session
            await promisifyLogout(req);
            await promisifySessionDestroy(req);

            // clear session cookie
            res.clearCookie("connect.sid");

            oauthLoggedOut = true;
        }

        // clear other potential session cookies
        const potentialSessionCookies = ["connect.sid", "session", "sess"];
        potentialSessionCookies.forEach(cookieName => {
            const cookieOptions = {
                ...baseCookieOptions,
                maxAge: 0,
                path: "/",
            };
            res.clearCookie(cookieName, cookieOptions);
        });

        return res.status(200).json({
            success: true,
            message: "logged out successfully",
            details: { tokensCleared, oauthLoggedOut },
        });
    } catch (error) {
        console.error("logout error:", error);
        next(error);
    }
}

/** 
async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        
          'Refresh not sent from client'
          to be revised later due to path value on
           refreshTokenCookieOptions in src/config/auth.ts
         
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

        const { userId } = (req as JWTAuthenticatedRequest).user!;

        // this will logout on all devices
        await prisma.refreshToken.deleteMany({
            where: {
                userId,
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
*/

export default unifiedLogout;
