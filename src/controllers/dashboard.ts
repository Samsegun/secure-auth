import express from "express";

function getDetails(req: express.Request, res: express.Response) {
    return res.json({ message: "dashboard response" });
}

export { getDetails };
