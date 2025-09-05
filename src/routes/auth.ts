import { Router } from "express";
import { signin, signUp } from "../controllers/auth";
import refreshTokens from "../controllers/refreshTokens";
import verifyEmail from "../controllers/verifyEmail";
import { createUser, signInUser, validate } from "../utils/validations";

const authRouter = Router();

authRouter.post("/signup", validate(createUser), signUp);
authRouter.post("/signin", validate(signInUser), signin);
authRouter.post("/refresh", validate(signInUser), refreshTokens);
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
