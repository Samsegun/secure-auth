import { Router } from "express";
import authRouter from "./authRoutes";
import protectedRouter from "./protectedRoutes";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/user", protectedRouter);

export default appRouter;
