import { Router } from "express";
import authenticateUser from "../middleware/authMiddleware";
import publicRouter from "./publicRoutes";
import userRouter from "./userRoutes";

const appRouter = Router();

appRouter.use("/auth", publicRouter);
appRouter.use("/user", authenticateUser, userRouter);

export default appRouter;
