import * as bcrypt from "bcrypt";
import CustomResponseType from "src/types/customResponseType";
import { errorRes } from "../responses/restResponse";
import { FullTokenPayload, TokenPayload } from "src/types/token-payload.type";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";

export class AuthUtil {
    private static readonly SALT_ROUNDS = 10;

    static async hashPassword(password: string): Promise<string> {
        if (!password) {
            throw new Error("Password is required");
        }
        return bcrypt.hash(password, AuthUtil.SALT_ROUNDS);
    }

    static async comparePassword(
        password: string,
        hash: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    static createTokenPayload(user: any): TokenPayload {
        const { id, avatar, ...rest } = user;
        return {
            userId: id,
            ...rest,
        };
    }

    static async generateAccessToken(
        jwtService: JwtService,
        user: any
    ): Promise<string> {
        const payload = AuthUtil.createTokenPayload(user);
        return jwtService.signAsync(payload);
    }

    static async generateRefreshToken(
        jwtService: JwtService,
        user: any
    ): Promise<string> {
        const payload = AuthUtil.createTokenPayload(user);
        return jwtService.signAsync(payload, { expiresIn: "7d" });
    }

    static async verifyRefreshToken(
        jwtService: JwtService,
        token: string
    ): Promise<FullTokenPayload> {
        return jwtService.verifyAsync(token);
    }

    static handleError(error: any): CustomResponseType<any> {
        console.error(error);
        return errorRes(error);
    }
}
