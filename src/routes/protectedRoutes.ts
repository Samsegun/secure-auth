import { Router } from "express";
import getDashboard from "../controllers/dashboard";
import logout from "../controllers/logout";
import { authenticateToken } from "../middleware/authMiddleware";

const protectedRouter = Router();

// dashboard routes
protectedRouter.get("/dashboard", authenticateToken, getDashboard);

// logout route
protectedRouter.get("/logout", authenticateToken, logout);

export default protectedRouter;
