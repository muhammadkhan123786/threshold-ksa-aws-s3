import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(private authService: AuthService) {
        super({
            usernameField: "email",
            passwordField: "password",
        });
    }

    async validate(email: string, password: string): Promise<any> {
        try {
            this.logger.log(`Attempting to validate user: ${email}`);

            if (!email || !password) {
                this.logger.warn(
                    "Missing email or password in authentication request"
                );
                throw new UnauthorizedException("Invalid credentials");
            }

            const user = await this.authService.validateUser(email, password);

            if (!user) {
                this.logger.warn(`Authentication failed for user: ${email}`);
                throw new UnauthorizedException("Invalid credentials");
            }

            this.logger.log(`User successfully authenticated: ${email}`);
            return user;
        } catch (error) {
            this.logger.error(`Authentication error: ${error.message}`);

            if (error instanceof UnauthorizedException) {
                throw error; // Rethrow the original unauthorized exception
            }

            // Throw a generic unauthorized exception for other errors
            throw new UnauthorizedException("Authentication failed");
        }
    }
}
