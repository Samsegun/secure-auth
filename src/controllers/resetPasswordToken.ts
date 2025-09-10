import { NextFunction, Response } from "express";
import { hashPassword } from "../utils/passwordUtils";
import prisma from "../utils/prisma";
import { AuthenticatedRequest, ErrorWithStatusCode } from "../utils/types";

async function resetPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { token, password: newPassword } = req.body;
        if (!token || !newPassword) {
            const error: ErrorWithStatusCode = new Error(
                "token and new password is required"
            );
            error.statusCode = 400;
            throw error;
        }

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpiry: { gt: new Date() },
                isVerified: true,
            },
        });
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "invalid or expired token",
            });
        }

        // hashpassword
        const hashedPassword = await hashPassword(newPassword);
        if (!hashedPassword) {
            const error = new Error("Server error");
            throw error;
        }

        // update password, clear resetToken and resetExpiry values
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpiry: null,
            },
        });

        // invalidate all existing refresh tokens for security
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id },
        });

        res.status(200).json({
            success: true,
            message:
                "Password reset successful. Please log in with your new password",
        });
    } catch (error) {
        next(error);
    }
}

export default resetPassword;
