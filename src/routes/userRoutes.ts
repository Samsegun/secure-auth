import { Router } from "express";
import getProfile from "../controllers/getProfile";
import logout from "../controllers/logout";
import adminRouter from "./adminRoutes";
import moderatorRouter from "./moderatorRoutes";

const userRouter = Router();

// general user routes
userRouter.get("/profile", getProfile);

// super user routes
userRouter.use("/admin", adminRouter);
userRouter.use("/moderator", moderatorRouter);

// logout route
userRouter.get("/logout", logout);

export default userRouter;
