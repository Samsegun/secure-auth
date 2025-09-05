import { NextFunction, Request, Response } from "express";

async function refreshTokens(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ message: "refresh tokens response" });
}

export default refreshTokens;
