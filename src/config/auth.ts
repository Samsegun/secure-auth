import { CookieOptions } from "express";

// ADJUST SUBSTRING POSITIONING WHEN EXPIRATION VALUES CHANGE!!!
const ACCESS_TOEKN_EXPIRY = parseInt(
    process.env.JWT_ACCESS_EXPIRATION!.substring(-1, 2)
);
const REFRESH_TOKEN_EXPIRY = parseInt(
    process.env.JWT_REFRESH_EXPIRATION!.substring(-1, 1)
);

export const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
};

export const accessTokenCookieOptions = {
    ...baseCookieOptions,
    maxAge: ACCESS_TOEKN_EXPIRY * 60 * 1000,
};

export const refreshTokenCookieOptions = {
    ...baseCookieOptions,
    path: "/api/auth/refresh",
    maxAge: REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000,
};

export const authConfig = {
    accessTokenExpiryMinutes: ACCESS_TOEKN_EXPIRY,
    refreshTokenExpiryDays: REFRESH_TOKEN_EXPIRY,
};
