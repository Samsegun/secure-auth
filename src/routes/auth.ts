import { Router } from "express";
import { login, signUp } from "../controllers/auth";
import refreshTokens from "../controllers/refreshTokens";
import verifyEmail from "../controllers/verifyEmail";
import { createUser, signInUser, validate } from "../utils/validations";

const authRouter = Router();

authRouter.post("/signup", validate(createUser), signUp);
authRouter.post("/login", validate(signInUser), login);
authRouter.post("/refresh", validate(signInUser), refreshTokens);
authRouter.post("/verify-email", validate(signInUser), verifyEmail);

export default authRouter;
