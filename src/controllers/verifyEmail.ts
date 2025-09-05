import { NextFunction, Request, Response } from "express";

async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ message: "verify email response" });
}

export default verifyEmail;
