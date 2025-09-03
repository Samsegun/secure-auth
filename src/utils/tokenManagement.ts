import jwt from "jsonwebtoken";
import { JwtPayload, RefreshTokenPayload } from "./types";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRATION!;
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRATION!;

function generateAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}

function generateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
}

function verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
}

function verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
