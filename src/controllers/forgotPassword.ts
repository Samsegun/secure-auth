import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { authConfig } from "../config/auth";
import { sendPasswordResetEmail } from "../utils/emailUtils";
import prisma from "../utils/prisma";
import { AuthenticatedRequest } from "../utils/types";

async function forgotPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, isVerified: true },
        });
        // trying not to reveal if email exists or not because of attackers
        if (!user || !user.isVerified) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account with this email exists, a password reset link has been sent.",
            });
        }

        const resetPasswordToken = uuidv4();
        const resetPasswordTokenExpiry = new Date(
            Date.now() + authConfig.refreshPasswordTokenTime * 60 * 1000
        );

        // update user with reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetPasswordToken,
                passwordResetExpiry: resetPasswordTokenExpiry,
            },
        });

        await sendPasswordResetEmail(email, resetPasswordToken);

        res.status(200).json({
            success: true,
            message:
                "If an account with this email exists, a password reset link has been sent.",
        });
    } catch (error) {
        next(error);
    }
}

export default forgotPassword;
