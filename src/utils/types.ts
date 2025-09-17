import { Request } from "express";
import { Role } from "../../generated/prisma";

interface ValidatedRequest<T = unknown> extends Request {
    validatedData: T;
}

interface AuthenticatedUser {
    userId: string;
    // email: string;
    role: Role;
    isVerified: boolean;
}

// passport user type (what comes from OAuth)
interface PassportUser {
    id: string;
    email: string;
    name?: string;
    role: string;
    avatar?: string;
}

interface JWTAuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

interface FlexibleAuthRequest extends Request {
    user?: AuthenticatedUser | PassportUser;
}

interface ErrorWithStatusCode extends Error {
    statusCode?: number;
    data?: any;
}

interface ValidationError extends Error {
    statusCode?: number;
    data?: { field: string; message: string }[];
}

interface JwtPayload {
    userId: string;
    // email: string;
    role: string;
    isVerified: boolean;
}

interface RefreshTokenPayload {
    userId: string;
    tokenId: string;
}

export {
    AuthenticatedUser,
    ErrorWithStatusCode,
    FlexibleAuthRequest,
    JWTAuthenticatedRequest,
    JwtPayload,
    RefreshTokenPayload,
    ValidatedRequest,
    ValidationError,
};
