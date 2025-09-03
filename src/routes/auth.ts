import { Router } from "express";
import { login, signUp } from "../controllers/auth";
import { createUser, signInUser, validate } from "../utils/validations";

const authRouter = Router();

authRouter.post("/signup", validate(createUser), signUp);
authRouter.post("/login", validate(signInUser), login);

export default authRouter;
