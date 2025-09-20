import { Request } from "express";

async function promisifyLogout(req: Request) {
    await new Promise<void>((resolve, reject) => {
        req.logout((err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function promisifySessionDestroy(req: Request) {
    await new Promise<void>((resolve, reject) => {
        req.session?.destroy((err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export { promisifyLogout, promisifySessionDestroy };
