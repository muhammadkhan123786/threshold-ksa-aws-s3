import { UserRole } from "src/enums/users.enum";

export type TokenPayload = {
    userId: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    role?: UserRole;
    createdAt?: Date;
};

export type FullTokenPayload = TokenPayload & {
    iat: number;
    exp: number;
};
