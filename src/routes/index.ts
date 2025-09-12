import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import publicRouter from "./publicRoutes";
import userRouter from "./userRoutes";

const appRouter = Router();

appRouter.use("/auth", publicRouter);
appRouter.use("/user", authenticateToken, userRouter);

export default appRouter;
