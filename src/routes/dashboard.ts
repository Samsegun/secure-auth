import { Router } from "express";
import { getDetails } from "../controllers/dashboard";
import authRequired from "../middleware/protected";

const dashboardRouter = Router();

dashboardRouter.get("/dashboard", authRequired, getDetails);

export default dashboardRouter;
