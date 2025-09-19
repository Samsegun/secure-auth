import passport from "passport";
import { Strategy as GoogleStartegy } from "passport-google-oauth20";
import prisma from "../utils/prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                avatar: true,
            },
        });

        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// google strategy
passport.use(
    new GoogleStartegy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // check if user already exists
                let user = await prisma.user.findUnique({
                    where: { email: profile.emails?.[0]?.value },
                });

                if (user) {
                    // update OAuth info if user exists
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            googleId: profile.id,
                            avatar: profile.photos?.[0]?.value || user.avatar,
                            username: user.username || profile.displayName,
                        },
                    });
                } else {
                    // create new user
                    user = await prisma.user.create({
                        data: {
                            email: profile.emails?.[0]?.value!,
                            username: profile.displayName,
                            googleId: profile.id,
                            avatar: profile.photos?.[0]?.value,
                            isVerified: true, // OAuth emails are pre-verified
                        },
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);

export default passport;
