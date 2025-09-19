import prisma from "../utils/prisma";

// helper function to normalize OAuth user to AuthenticatedUser format
async function normalizeOAuthUser(passportUser: any) {
    try {
        console.log("passportuser in normalize middleware", passportUser);
        // get full user data from database to ensure consistency
        const user = await prisma.user.findUnique({
            where: { id: passportUser.id },
            select: {
                id: true,
                role: true,
                isVerified: true,
            },
        });

        if (!user) {
            return null;
        }

        // OAuth users are considered verified since their email is from the provider
        return {
            userId: user.id,
            role: user.role,
            isVerified: user.isVerified,
        };
    } catch (error) {
        console.error("Error normalizing OAuth user:", error);
        return null;
    }
}

export default normalizeOAuthUser;
