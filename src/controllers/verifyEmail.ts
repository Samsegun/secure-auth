import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import { ErrorWithStatusCode } from "../utils/types";

// async function verifyEmail(req: Request, res: Response, next: NextFunction) {
//     return res.status(200).json({ message: "verify email response" });
// }

async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.query;

        if (!token || typeof token !== "string") {
            const error: ErrorWithStatusCode = new Error(
                "verification token is required"
            );
            error.statusCode = 400;
            throw error;
        }

        // find user with this verification token
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiry: { gt: new Date() },
                isVerified: false,
            },
        });
        if (!user) {
            const error: ErrorWithStatusCode = new Error(
                "invalid or expired verification token"
            );
            error.statusCode = 400;
            throw error;
        }

        // update isVerified field to true
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiry: null,
            },
        });

        res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now sign in.",
        });
    } catch (error) {
        next(error);
    }
}

export default verifyEmail;
