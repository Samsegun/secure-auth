import express from "express";
import { z } from "zod";
import { ErrorWithStatusCode, ValidationError } from "./types";

const createUser = z.object({
    email: z.email("Invalid email format"),
    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[@$!%*?&]/,
            "Password must contain at least one special character"
        ),
});

const signInUser = z.object({
    email: z.email("Invalid email format"),
    password: z.string().trim(),
});

const validateForgotPassword = createUser.omit({ password: true });
const validateResetPassword = createUser.omit({ email: true });

// validation middleware
const validate = (schema: z.ZodSchema) => {
    return (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const error: ValidationError = new Error("Validation failed");
            error.statusCode = 400;
            error.data = result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            throw error;
        }

        req.validatedData = result.data;
        next();
    };
};

const validateUserIdAndCreatorId = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    // throw error if creator id does not match user id
    if (req.validatedData.creator !== req.userId) {
        const error: ErrorWithStatusCode = new Error("Operation failed!");
        error.statusCode = 403;
        throw error;
    }

    next();
};

export {
    createUser,
    signInUser,
    validate,
    validateForgotPassword,
    validateResetPassword,
    validateUserIdAndCreatorId,
};
