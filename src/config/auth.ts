import { CookieOptions } from "express";

// ADJUST SUBSTRING POSITIONING WHEN EXPIRATION VALUES CHANGE!!!
const ACCESS_TOEKN_EXPIRY = parseInt(
    process.env.JWT_ACCESS_EXPIRATION!.substring(-1, 2)
);
const REFRESH_TOKEN_EXPIRY = parseInt(
    process.env.JWT_REFRESH_EXPIRATION!.substring(-1, 1)
);
const MAX_AGE = REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000;

export const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
};

/**
 * The accessToken cookie maxAge is same as the refreshToken.
 * If accessToken cookie maxAge is short-lived(e.g 5mins),
 * the browser deletes the cookie once it expired. That would cause the
 * auth middleware to incorrectly report "Access token not found" instead of
 * properly detecting and handling an expired token.
 */
export const accessTokenCookieOptions = {
    ...baseCookieOptions,
    // maxAge: ACCESS_TOEKN_EXPIRY * 60 * 1000,
    maxAge: MAX_AGE,
};

/**
 * refreshToken cookie is scoped to /api/auth/refresh
 * so it’s only sent when requesting new access tokens.
 * This reduces exposure by keeping it off normal API calls.
 */
export const refreshTokenCookieOptions = {
    ...baseCookieOptions,
    path: "/api/auth/refresh",
    maxAge: MAX_AGE,
};

export const authConfig = {
    accessTokenExpiryMinutes: ACCESS_TOEKN_EXPIRY,
    refreshTokenExpiryDays: REFRESH_TOKEN_EXPIRY,
};
