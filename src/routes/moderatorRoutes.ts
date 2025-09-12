import { Router } from "express";
import { Role } from "../../generated/prisma";
import getUsers from "../controllers/getUsers";
import checkRole from "../middleware/roleMiddleware";

const moderatorRouter = Router();

moderatorRouter.use(checkRole([Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN]));

moderatorRouter.get("/view-users", getUsers);

export default moderatorRouter;
