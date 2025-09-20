import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "./config/passport";
import appRouter from "./routes";
import { ErrorWithStatusCode } from "./utils/types";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
    cors({
        origin: (origin, callback) => {
            // requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

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
