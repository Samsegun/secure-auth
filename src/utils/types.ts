import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            validatedData?: any;
            userId?: string;
        }
    }
}

interface ErrorWithStatusCode extends Error {
    statusCode?: number;
    data?: any;
}

interface ValidationError extends Error {
    statusCode?: number;
    data?: { field: string; message: string }[];
}

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        isVerified: boolean;
    };
}

interface JwtPayload {
    userId: string;
    email: string;
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
    ValidationError,
};
