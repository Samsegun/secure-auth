import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
    accessTokenCookieOptions,
    authConfig,
    refreshTokenCookieOptions,
} from "../config/auth";
import { sendVerificationEmail } from "../utils/emailUtils";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import prisma from "../utils/prisma";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/tokenManagement";
import { ErrorWithStatusCode } from "../utils/types";

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

async function signin(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.validatedData;

        // find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                isVerified: true,
                role: true,
            },
        });
        if (!user) {
            const error: ErrorWithStatusCode = new Error("invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        // compare passwords
        const passwordIsEqual = await comparePassword(password, user.password);
        if (!passwordIsEqual) {
            const error: ErrorWithStatusCode = new Error(
                "invalid credentials!"
            );
            error.statusCode = 401;
            throw error;
        }

        // check if email is verified
        if (!user.isVerified) {
            const error: ErrorWithStatusCode = new Error(
                "please verify your email before signing in"
            );
            error.statusCode = 403;
            throw error;
        }

        // generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            isVerified: user.isVerified,
        });

        const refreshTokenId = uuidv4();
        const refreshToken = generateRefreshToken({
            userId: user.id,
            tokenId: refreshTokenId,
        });

        // store refresh token in database
        await prisma.refreshToken.create({
            data: {
                id: refreshTokenId,
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() +
                        authConfig.refreshTokenExpiryTime * 24 * 60 * 60 * 1000
                ),
            },
        });

        // set cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        res.status(200).json({
            message: "Signed in successfully",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

export { signin, signUp };
