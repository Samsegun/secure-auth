import { Router } from "express";
import protectedRouter from "./protectedRoutes";
import publicRouter from "./publicRoutes";

const appRouter = Router();

appRouter.use("/auth", publicRouter);
appRouter.use("/user", protectedRouter);

export default appRouter;
