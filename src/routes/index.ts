import { Router } from "express";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/dashboard", dashboardRouter);

export default appRouter;
