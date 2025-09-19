import { Router } from "express";
import { signin, signUp } from "../controllers/auth";
import forgotPassword from "../controllers/forgotPassword";
import refreshTokens from "../controllers/refreshTokens";
import resetPassword from "../controllers/resetPasswordToken";
import verifyEmail from "../controllers/verifyEmail";
import {
    createUser,
    signInUser,
    validate,
    validateForgotPassword,
    validateResetPassword,
} from "../utils/validations";
import oauthRouter from "./oauthRoutes";

const publicRouter = Router();

const validateSignUp = validate(createUser);
const validateSignIn = validate(signInUser);

publicRouter.use(oauthRouter);

publicRouter.post("/signup", validateSignUp, signUp);
publicRouter.post("/signin", validateSignIn, signin);
publicRouter.post(
    "/forgot-password",
    validate(validateForgotPassword),
    forgotPassword
);
publicRouter.post(
    "/reset-password",
    validate(validateResetPassword),
    resetPassword
);
publicRouter.post("/refresh", refreshTokens);
publicRouter.get("/verify-email", verifyEmail);

export default publicRouter;
