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

interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
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

type User = {
    id: number;
    username: string;
    password: string;
};

export {
    AuthenticatedRequest,
    ErrorWithStatusCode,
    JwtPayload,
    RefreshTokenPayload,
    User,
    ValidatedRequest,
    ValidationError,
};
