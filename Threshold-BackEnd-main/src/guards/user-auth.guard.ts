import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/schemas/users/users.service";
import { UserRole } from "src/enums/users.enum";

@Injectable()
export class UserAuthGuard extends AuthGuard("jwt") implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private usersService: UsersService
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException("Authorization header is missing");
        }

        const token = authHeader.split(" ")[1];

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.getUserById(payload.userId);

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            request.user = user;

            const requiredRoles = this.reflector.get<UserRole | string[]>(
                "roles",
                context.getHandler()
            );
            if (requiredRoles && !requiredRoles.includes(user.payload.role)) {
                throw new UnauthorizedException(
                    "You do not have permission to access this resource"
                );
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
}
