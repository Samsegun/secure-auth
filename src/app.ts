import cors from "cors";
import express from "express";
import morgan from "morgan";
import appRouter from "./routes";
import { ErrorWithStatusCode } from "./utils/types";

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/api", appRouter);

app.use(
    (
        err: ErrorWithStatusCode,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.log(err);
        const code = err.statusCode || 500;
        const message = err.message;
        const data = err.data || null;

        res.status(code).json({ message, data });
    }
);

export default app;
