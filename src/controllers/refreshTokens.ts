import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import {
    accessTokenCookieOptions,
    authConfig,
    refreshTokenCookieOptions,
} from "../config/auth";
import prisma from "../utils/prisma";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/tokenManagement";
import { ErrorWithStatusCode } from "../utils/types";

export const refreshTokens = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            const error: ErrorWithStatusCode = new Error(
                "refresh token not found"
            );
            error.statusCode = 401;
            throw error;
        }

        // verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // find refresh token in database
        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                id: decoded.tokenId,
                userId: decoded.userId,
                expiresAt: { gt: new Date() },
            },

            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        isVerified: true,
                    },
                },
            },
        });
        if (!storedToken) {
            const error: ErrorWithStatusCode = new Error(
                "invalid refresh token"
            );
            error.statusCode = 401;
            throw error;
        }

        // delete old refresh token (rotation)
        await prisma.refreshToken.delete({
            where: { id: storedToken.id },
        });

        // generate new tokens
        const newAccessToken = generateAccessToken({
            userId: storedToken.user.id,
            // email: storedToken.user.email,
            role: storedToken.user.role,
            isVerified: storedToken.user.isVerified,
        });

        const newRefreshTokenId = uuidv4();
        const newRefreshToken = generateRefreshToken({
            userId: storedToken.user.id,
            tokenId: newRefreshTokenId,
        });

        // store new refresh token
        await prisma.refreshToken.create({
            data: {
                id: newRefreshTokenId,
                token: newRefreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(
                    Date.now() +
                        authConfig.refreshTokenExpiryTime * 24 * 60 * 60 * 1000
                ),
            },
        });

        // set new cookies
        res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

        res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
        });
    } catch (error) {
        next(error);
    }
};

export default refreshTokens;
