import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/schemas/users/users.service";
import { CoachesService } from "src/schemas/coaches/coaches.service";
import { UserRole } from "src/enums/users.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private coachesService: CoachesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET"),
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.getUserById(payload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }

        if (!user.payload.isApproved) {
            throw new UnauthorizedException("User not approved");
        }

        if (user.payload.role === UserRole.COACH) {
            const coachId = await this.coachesService.getCoachIdByUserId(
                user.payload.id
            );
            if (coachId) {
                user.payload["coachId"] = coachId;
            }
        }

        return user;
    }
}
