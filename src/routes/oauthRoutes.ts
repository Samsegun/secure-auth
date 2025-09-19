import { Router } from "express";
import passport from "passport";

const oauthRouter = Router();

const PORT = process.env.PORT!;
// const FRONTEND_URL = process.env.FRONTEND_URL!

oauthRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// oauthRouter.get('/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`
//     }),
//     (req, res) => {
//         // successful authentication
//         res.redirect(`${FRONTEND_URL}/dashboard`);
//     }
// );

oauthRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `http://localhost:${PORT}/api/login?error=oauth_failed`,
    }),
    (req, res) => {
        // successful authentication
        res.redirect(`http://localhost:${PORT}/api/dashboard`);
    }
);

// Get current user (for frontend to check auth status)
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

// Logout route
oauthRouter.post("/logout", (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error logging out",
            });
        }
        res.json({
            success: true,
            message: "Logged out successfullyasaa",
        });
    });
});

export default oauthRouter;
