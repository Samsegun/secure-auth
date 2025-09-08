import { Router } from "express";
import { signin, signUp } from "../controllers/auth";
import refreshTokens from "../controllers/refreshTokens";
import verifyEmail from "../controllers/verifyEmail";
import { createUser, signInUser, validate } from "../utils/validations";

const publicRouter = Router();

publicRouter.post("/signup", validate(createUser), signUp);
publicRouter.post("/signin", validate(signInUser), signin);
publicRouter.post("/refresh", refreshTokens);
publicRouter.get("/verify-email", verifyEmail);

export default publicRouter;
