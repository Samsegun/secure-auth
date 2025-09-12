import { Router } from "express";
import { Role } from "../../generated/prisma";
import deleteUser from "../controllers/deleteUser";
import getModerators from "../controllers/getModerators";
import checkRole from "../middleware/roleMiddleware";

const adminRouter = Router();

adminRouter.use(checkRole([Role.ADMIN, Role.SUPER_ADMIN]));

adminRouter.get("/view-mods", getModerators);
adminRouter.delete("/delete-user", deleteUser);

export default adminRouter;
