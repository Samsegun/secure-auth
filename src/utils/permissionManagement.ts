import { Role } from "../../generated/prisma";

export const Permissions = {
    // user management
    CREATE_USER: [Role.ADMIN, Role.SUPER_ADMIN],
    DELETE_USER: [Role.SUPER_ADMIN],
    UPDATE_USER: [Role.ADMIN, Role.SUPER_ADMIN],
    VIEW_USERS: [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN],

    // content management
    CREATE_CONTENT: [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN],
    DELETE_CONTENT: [Role.ADMIN, Role.SUPER_ADMIN],
    UPDATE_CONTENT: [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN],
    VIEW_CONTENT: [Role.USER, Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN],
};

export const hasPermission = (
    userRole: Role,
    allowedRoles: Role[]
): boolean => {
    return allowedRoles.includes(userRole);
};
