import { Router } from "express";
import { getDetails } from "../controllers/dashboard";
import { authenticateToken } from "../middleware/protected";

const dashboardRouter = Router();

dashboardRouter.get("/dashboard", authenticateToken, getDetails);

export default dashboardRouter;
