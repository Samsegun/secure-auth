import { Router } from "express";
import { authenticateUserToken } from "../middleware/authMiddleware";
import publicRouter from "./publicRoutes";
import userRouter from "./userRoutes";

const appRouter = Router();

// temporary routes to be deleted
appRouter.use("/login", (req, res) => {
    const { error } = req.query;

    if (error) {
        console.log(error);
        return res.send("<section><h1>login error endpoint</h1></section");
    }

    res.send("<section><h1>login endpoint</h1></section");
});
appRouter.use("/dashboard", (req, res) => {
    res.send("<section><h1>what user sees on frontend</h1></section");
});

appRouter.use("/auth", publicRouter);
appRouter.use("/user", authenticateUserToken, userRouter);

export default appRouter;
