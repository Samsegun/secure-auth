import { Router } from "express";
import { authenticateUserToken } from "../middleware/authMiddleware";
import publicRouter from "./publicRoutes";
import userRouter from "./userRoutes";

const appRouter = Router();

appRouter.use("/auth", publicRouter);
appRouter.use("/user", authenticateUserToken, userRouter);

export default appRouter;
