import {
    Injectable,
    UnauthorizedException,
    InternalServerErrorException,
    Logger,
    HttpStatus,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { I18nService } from "src/i18n/i18n.service";
import { AuthUtil } from "src/lib/helpers/auth.util";
import { errorRes, foundRes } from "src/lib/responses/restResponse";
import { UsersService } from "src/schemas/users/users.service";
import { SportProfilesService } from "src/schemas/sportProfiles/sportProfiles.service";
import { AcademiesService } from "src/schemas/academies/academies.service";
import { MailerService } from "src/mailer/mailer.service";
import { emailValidator } from "src/middlewares/validators";
import { RegisterDto } from "src/dto/users/create-academy-admin.dto";
import { ResetToken } from "src/entities/resetToken.entity";
import { SportProfileType } from "src/enums/athletes.enum";
import { UserRole } from "src/enums/users.enum";
import CustomResponseType from "src/types/customResponseType";
import { FullTokenPayload } from "src/types/token-payload.type";
import { validRes } from "src/lib/responses/validationResponse";
import { UnifiedDto } from "src/dto/users/create-company-register.dto";
import { S3Service } from "src/s3/s3.service";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(ResetToken)
        private resetTokenRepository: Repository<ResetToken>,
        private jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly sportProfilesService: SportProfilesService,
        private readonly academiesService: AcademiesService,
        private readonly mailerService: MailerService,
        private readonly i18nService: I18nService,
        private readonly s3Service: S3Service
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.checkUserCredentials({
            identifier: {
                type: emailValidator(email) ? "email" : "username",
                value: email,
            },
            password,
        });

        if (!this.isSuccessStatus(user.status)) {
            throw new UnauthorizedException(
                this.i18nService.translate("auth.invalid_credentials")
            );
        }

        return user.payload;
    }

    async logIn(
        identifier: string,
        password: string
    ): Promise<CustomResponseType<any>> {
        try {
            const user = await this.validateUserCredentials(
                identifier,
                password
            );

            const accessToken = await AuthUtil.generateAccessToken(
                this.jwtService,
                user
            );
            const refreshToken = await AuthUtil.generateRefreshToken(
                this.jwtService,
                user
            );

            return this.generateSuccessResponseWithTokens(
                accessToken,
                refreshToken,
                user
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async refreshTokens(
        refreshToken: string
    ): Promise<CustomResponseType<any>> {
        try {
            const payload = await AuthUtil.verifyRefreshToken(
                this.jwtService,
                refreshToken
            );
            const user = await this.usersService.getUserById(payload.userId);

            if (!user) {
                throw new UnauthorizedException(
                    this.i18nService.translate("auth.invalid_refresh_token")
                );
            }

            const userPayload = user.payload;

            if (!userPayload.isApproved) {
                throw new UnauthorizedException(
                    this.i18nService.translate("auth.invalid_refresh_token")
                );
            }

            const newAccessToken = await AuthUtil.generateAccessToken(
                this.jwtService,
                userPayload
            );
            const newRefreshToken = await AuthUtil.generateRefreshToken(
                this.jwtService,
                userPayload
            );

            // Update the stored refresh token in the database if needed

            return this.generateSuccessResponseWithTokens(
                newAccessToken,
                newRefreshToken,
                userPayload
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    private async validateUserCredentials(
        identifier: string,
        password: string
    ) {
        const result = await this.usersService.checkUserCredentials({
            identifier: {
                type: emailValidator(identifier) ? "email" : "username",
                value: identifier,
            },
            password,
        });

        if (result.status !== 200) {
            throw new UnauthorizedException(result);
        }

        return result.payload;
    }

    private generateSuccessResponseWithTokens(
        accessToken: string,
        refreshToken: string,
        user: any
    ): CustomResponseType<any> {
        return validRes(this.i18nService.translate("auth.tokens_generated"), {
            access_token: accessToken,
            refresh_token: refreshToken,
            email: user.email,
            username: user.username,
            role: user.role,
            phoneNumber: user.phoneNumber,
            userId: user.id,
            avatar: user.avatar,
            academy: user.academy,
            language: user.language,
        });
    }

    async register(
        createAcademyAdminDto: Omit<RegisterDto, "academy">,
        userTokenData: FullTokenPayload
    ): Promise<CustomResponseType<any>> {
        try {
            this.logger.log(
                `Starting registration for ${createAcademyAdminDto.email}`
            );

            const newAcademy = await this.academiesService.createAcademy({
                contactNumber: createAcademyAdminDto.contactNumber,
                registrationNumber: createAcademyAdminDto.registrationNumber,
                name: createAcademyAdminDto.name,
                isMultiBranch: createAcademyAdminDto.isMultiBranch,
            });

            if (!this.isSuccessStatus(newAcademy.status)) {
                this.logger.error(
                    `Failed to create academy: ${JSON.stringify(newAcademy)}`
                );
                return errorRes(newAcademy);
            }
            this.logger.log(
                `Academy created with ID: ${newAcademy.payload.id} (Status: ${newAcademy.status})`
            );

            const newUser = await this.usersService.createUser(
                {
                    academy: newAcademy.payload.id,
                    email: createAcademyAdminDto.email,
                    password: createAcademyAdminDto.password,
                    username: createAcademyAdminDto.username,
                    role:
                        createAcademyAdminDto.organizationType === "academy"
                            ? UserRole.ACADEMY_ADMIN
                            : UserRole.CLUB_ADMIN,
                },
                userTokenData
            );

            if (!this.isSuccessStatus(newUser.status)) {
                this.logger.error(
                    `Failed to create user: ${JSON.stringify(newUser)}`
                );
                return errorRes(newUser);
            }
            this.logger.log(
                `User created with ID: ${newUser.payload.id} (Status: ${newUser.status})`
            );

            const newSportProfile =
                await this.sportProfilesService.createSportProfile({
                    academy: newAcademy.payload.id,
                    sport: SportProfileType.FOOTBALL,
                });

            if (!this.isSuccessStatus(newSportProfile.status)) {
                this.logger.error(
                    `Failed to create sport profile: ${JSON.stringify(newSportProfile)}`
                );
                return errorRes(newSportProfile);
            }
            this.logger.log(
                `Sport profile created with ID: ${newSportProfile.payload.id} (Status: ${newSportProfile.status})`
            );

            try {
                await this.mailerService.sendRegistrationEmail(
                    createAcademyAdminDto.email,
                    createAcademyAdminDto.username,
                    newAcademy.payload.name
                );
                this.logger.log(
                    `Registration email sent to: ${createAcademyAdminDto.email}`
                );
            } catch (emailError) {
                this.logger.error(
                    `Failed to send registration email: ${emailError.message}`
                );
                // Continue even if email fails
            }

            return foundRes(
                this.i18nService.translate("auth.registration_success"),
                {
                    admin: newUser,
                    academy: newAcademy,
                }
            );
        } catch (error) {
            this.logger.error(`Registration failed: ${error.message}`);
            this.logger.error(error.stack);
            return this.handleErrorWithTranslation(error);
        }
    }

    private generateS3Path(clubName: string): string {
        return `company/${clubName}-${Date.now()}/avatar`;
    }

    /**
     * Helper method to check if a status code represents success
     * @param status HTTP status code
     * @returns boolean indicating if the status code represents success
     */
    private isSuccessStatus(status: number): boolean {
        return status >= 200 && status < 300;
    }

    async companyRegister(
        createAcademyAdminDto: UnifiedDto,
        userTokenData: FullTokenPayload,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<any>> {
        try {
            this.logger.log(
                `Starting company registration for ${createAcademyAdminDto.email}`
            );
            let avatarUrl: string | null = null;

            if (avatar) {
                try {
                    this.logger.log("Uploading avatar to S3...");
                    const s3Path = this.generateS3Path(
                        createAcademyAdminDto.name
                    );
                    avatarUrl = await this.s3Service.uploadFile(s3Path, avatar);
                    this.logger.log("Avatar uploaded successfully");
                } catch (error) {
                    this.logger.error(
                        `Failed to upload avatar: ${error.message}`
                    );
                    // Continue without avatar if upload fails
                }
            }

            this.logger.log("Creating academy...");
            const newAcademy = await this.academiesService.createAcademy({
                contactNumber: createAcademyAdminDto.contactNumber,
                registrationNumber: createAcademyAdminDto.registrationNumber,
                name: createAcademyAdminDto.name,
                address: createAcademyAdminDto.address,
                phoneNumbers: createAcademyAdminDto.phoneNumbers,
                avatarUrl,
            });

            if (!this.isSuccessStatus(newAcademy.status)) {
                this.logger.error(
                    `Failed to create academy: ${JSON.stringify(newAcademy)}`
                );
                return errorRes(newAcademy);
            }
            this.logger.log(
                `Academy created with ID: ${newAcademy.payload.id} (Status: ${newAcademy.status})`
            );

            this.logger.log("Creating user...");
            const newUser = await this.usersService.createUser(
                {
                    academy: newAcademy.payload.id,
                    email: createAcademyAdminDto.email,
                    password: createAcademyAdminDto.password,
                    username: createAcademyAdminDto.username,
                    role:
                        createAcademyAdminDto.organizationType === "academy"
                            ? UserRole.ACADEMY_ADMIN
                            : UserRole.CLUB_ADMIN,
                },
                userTokenData
            );

            if (!this.isSuccessStatus(newUser.status)) {
                this.logger.error(
                    `Failed to create user: ${JSON.stringify(newUser)}`
                );
                return errorRes(newUser);
            }
            this.logger.log(
                `User created with ID: ${newUser.payload.id} (Status: ${newUser.status})`
            );

            this.logger.log("Creating sport profile...");
            const newSportProfile =
                await this.sportProfilesService.createSportProfile({
                    academy: newAcademy.payload.id,
                    sport: SportProfileType.FOOTBALL,
                });

            if (!this.isSuccessStatus(newSportProfile.status)) {
                this.logger.error(
                    `Failed to create sport profile: ${JSON.stringify(newSportProfile)}`
                );
                return errorRes(newSportProfile);
            }
            this.logger.log(
                `Sport profile created with ID: ${newSportProfile.payload.id} (Status: ${newSportProfile.status})`
            );

            try {
                this.logger.log("Sending registration email...");
                await this.mailerService.sendRegistrationEmail(
                    createAcademyAdminDto.email,
                    createAcademyAdminDto.username,
                    newAcademy.payload.name
                );
                this.logger.log("Registration email sent successfully");
            } catch (emailError) {
                // Don't fail registration if email fails
                this.logger.error(
                    `Failed to send registration email: ${emailError.message}`
                );
            }

            this.logger.log("Registration completed successfully");
            return foundRes(
                this.i18nService.translate("auth.registration_success"),
                {
                    admin: newUser,
                    academy: newAcademy,
                }
            );
        } catch (error) {
            this.logger.error(`Registration failed: ${error.message}`);
            this.logger.error(error.stack);
            return this.handleErrorWithTranslation(error);
        }
    }

    async forgetPassword(email: string): Promise<CustomResponseType<any>> {
        try {
            const user = await this.usersService.findUserByEmail(email);
            if (!user) {
                return errorRes(
                    this.i18nService.translate("auth.user_not_found")
                );
            }

            const token = this.jwtService.sign(
                { userId: user.id },
                { expiresIn: "1h" }
            );

            const tokenEntity = this.resetTokenRepository.create({
                token,
                user,
            });

            await this.resetTokenRepository.save(tokenEntity);
            await this.mailerService.sendPasswordResetEmail(
                email,
                tokenEntity.id,
                user.username,
                user.academy?.name
            );

            return foundRes(
                this.i18nService.translate("auth.password_reset_email_sent"),
                {}
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async resetPassword(
        token: string,
        newPassword: string
    ): Promise<CustomResponseType<any>> {
        try {
            const tokenEntity = await this.resetTokenRepository.findOne({
                where: { id: token },
                relations: ["user"],
            });

            if (!tokenEntity) {
                return errorRes(
                    this.i18nService.translate("auth.invalid_token")
                );
            }

            const payload = this.jwtService.verify(tokenEntity.token);
            const user = await this.usersService.getUserById(payload.userId);

            if (!user || !this.isSuccessStatus(user.status)) {
                return errorRes(
                    this.i18nService.translate("auth.user_not_found")
                );
            }

            const response = await this.usersService.updateUserPassword(
                user.payload.id,
                {
                    password: newPassword,
                }
            );

            await this.resetTokenRepository.softRemove(tokenEntity);

            return foundRes(
                this.i18nService.translate("auth.password_reset_success"),
                response
            );
        } catch (error) {
            this.logger.error(`Password reset failed: ${error.message}`);
            return this.handleErrorWithTranslation(error);
        }
    }

    private handleErrorWithTranslation(error: any): CustomResponseType<any> {
        this.logger.error(`Auth error: ${error.message || "Unknown error"}`);

        // Check if the error already has a structured response
        if (error.status && error.message) {
            this.logger.error(`Error details: ${JSON.stringify(error)}`);
            return errorRes(error);
        }

        // Log stack trace for debugging
        if (error.stack) {
            this.logger.error(`Stack trace: ${error.stack}`);
        }

        if (error instanceof UnauthorizedException) {
            return errorRes(this.i18nService.translate("auth.unauthorized"));
        } else if (error instanceof InternalServerErrorException) {
            return errorRes(
                this.i18nService.translate("auth.internal_server_error")
            );
        } else {
            // Provide more detailed error information when possible
            const errorMessage =
                error?.response?.message ||
                error.message ||
                this.i18nService.translate("auth.unknown_error");
            return errorRes(errorMessage);
        }
    }
}
