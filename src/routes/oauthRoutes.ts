import { Router } from "express";
import passport from "passport";

const oauthRouter = Router();

const FRONTEND_URL = process.env.FRONTEND_URL!;

oauthRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

oauthRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${FRONTEND_URL}/signin?error=oauth_failed`,
    }),
    (req, res) => {
        // successful authentication
        res.redirect(`${FRONTEND_URL}/`);
    }
);

// get current user (for frontend to check auth status)
oauthRouter.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: req.user,
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Not authenticated",
        });
    }
});

export default oauthRouter;
