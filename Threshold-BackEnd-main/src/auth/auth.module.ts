import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/schemas/users/users.module";
import { AcademiesModule } from "src/schemas/academies/academies.module";
import { SportProfilesModule } from "src/schemas/sportProfiles/sportProfiles.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { CoachesModule } from "src/schemas/coaches/coaches.module";
import { MailerModule } from "src/mailer/mailer.module";
import { ResetToken } from "src/entities/resetToken.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        UsersModule,
        AcademiesModule,
        SportProfilesModule,
        PassportModule,
        CoachesModule,
        MailerModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: "1000d" },
            }),
            inject: [ConfigService],
        }),

        TypeOrmModule.forFeature([ResetToken]),
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
