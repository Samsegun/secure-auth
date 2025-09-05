import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../utils/emailUtils";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import prisma from "../utils/prisma";
import { ErrorWithStatusCode } from "../utils/types";

// ADJUST SUBSTRING POSITIONING WHEN EXPIRATION VALUES CHANGE!!!
const ACCESS_TOEKN_EXPIRY = parseInt(
    process.env.JWT_ACCESS_EXPIRATION!.substring(-1, 2)
);
const REFRESH_TOKEN_EXPIRY = parseInt(
    process.env.JWT_REFRESH_EXPIRATION!.substring(-1, 1)
);

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
};

const accessTokenCookieOptions = {
    ...cookieOptions,
    maxAge: ACCESS_TOEKN_EXPIRY * 60 * 1000,
};

const refreshTokenCookieOptions = {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000,
};

async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.validatedData;

        console.log(email, password);

        // check if user exists
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (userExists) {
            const error: ErrorWithStatusCode = new Error("user already exists");
            error.statusCode = 400;
            throw error;
        }

        // hashpassword and generate verification token
        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            const error = new Error("Server error");
            throw error;
        }
        const verificationToken = uuidv4();
        const verificationTokenExpiry = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ); //24hrs

        // create user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpiry,
            },
        });
        if (!newUser) {
            const error = new Error("Failed to create user");
            throw error;
        }

        // send verification email
        await sendVerificationEmail(email, verificationToken);

        return res.status(201).json({
            message: "User created. Please check email to verify account",
            data: {
                user: newUser.id,
                email: newUser.email,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function login(req: Request, res: Response, next: NextFunction) {
    console.log(req.validatedData);

    try {
        const { email, password } = req.validatedData;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            const error: ErrorWithStatusCode = new Error("no user found!");
            error.statusCode = 400;
            throw error;
        }

        // compare passwords
        const passwordIsEqual = await comparePassword(password, user.password);
        if (!passwordIsEqual) {
            const error: ErrorWithStatusCode = new Error(
                "Invalid credentials!"
            );
            error.statusCode = 400;
            throw error;
        }

        return res.status(200).json({ message: "User created", user });
    } catch (error) {
        next(error);
    }
}

export { login, signUp };
