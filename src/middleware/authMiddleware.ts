import { NextFunction, Request, Response } from "express";
import { ErrorWithStatusCode, JWTAuthenticatedRequest } from "../utils/types";
import authenticateUserToken from "./customAuthMiddleware";
import normalizeOAuthUser from "./oauthMiddleware";

// unified authentication middleware
export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // check for JWT authentication first
        if (req.cookies.accessToken) {
            console.log("attempting JWT authentication");
            return authenticateUserToken(
                req as JWTAuthenticatedRequest,
                res,
                next
            );
        }

        // if there's no acessToken, check for oauth user
        if (req.isAuthenticated && req.isAuthenticated()) {
            console.log("found OAuth session, normalizing user");

            const userData = await req.user;
            if (!userData) {
                const error: ErrorWithStatusCode = new Error(
                    "No user data found"
                );
                error.statusCode = 401;
                throw error;
            }

            const normalizedUser = await normalizeOAuthUser(userData);

            if (!normalizedUser) {
                const error: ErrorWithStatusCode = new Error(
                    "Invalid OAuth user session"
                );
                error.statusCode = 401;
                throw error;
            }

            // set user in the same format as custom auth
            (req as JWTAuthenticatedRequest).user = normalizedUser;
            return next();
        }

        // if the checks above fails then it means no valid authentication found
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    } catch (error) {
        console.error("Authentication error:", error);
        next(error);
    }
}

export default authenticateUser;
