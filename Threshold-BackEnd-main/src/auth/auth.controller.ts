import {
    Body,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    Logger,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { LoginUserDto } from "src/dto/users/login-user.dto";
import { UsersService } from "src/schemas/users/users.service";
import { AuthService } from "./auth.service";
import { EditorsWrapper, ControllerWrapper } from "src/decorators";
import { RegisterDto } from "src/dto/users/create-academy-admin.dto";
import CustomResponseType from "src/types/customResponseType";
import { UserRole } from "src/enums/users.enum";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { ForgetPasswordDto } from "src/dto/users/forget-password.dto";
import { ResetPasswordDto } from "src/dto/users/reset-password.dto";
import { UnifiedDto } from "src/dto/users/create-company-register.dto";
import { CompanyRegisterSwagger } from "./swagger-decorators";
import { FileInterceptor } from "@nestjs/platform-express";

const transferMapping: NewInstanceTransformer = {};

@ControllerWrapper("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @Post("login")
    @ApiOperation({
        summary: "log in to create a local auth token (only for logging in)",
    })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginUserDto })
    async logIn(@Body() body: LoginUserDto, @Res() res: Response) {
        const { email, password } = body;
        const response = await this.authService.logIn(email, password);
        return res.status(response.status).json(response);
    }

    @Post("refresh")
    @ApiOperation({ summary: "Refresh access token" })
    @ApiBody({ type: String, description: "Refresh token" })
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Body("refreshToken") refreshToken: string,
        @Res() res: Response
    ) {
        const response = await this.authService.refreshTokens(refreshToken);
        return res.status(response.status).json(response);
    }

    @Post("company-register")
    @UseInterceptors(FileInterceptor("avatar"))
    @UsePipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    )
    @CompanyRegisterSwagger()
    async companyRegister(
        @Body() unifiedDto: UnifiedDto,
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFile() avatar: Express.Multer.File
    ): Promise<Response> {
        try {
            this.logger.log(
                `Company registration attempt for: ${unifiedDto.email}`
            );

            unifiedDto.role =
                unifiedDto.organizationType === "academy"
                    ? UserRole.ACADEMY_ADMIN
                    : UserRole.CLUB_ADMIN;

            this.logger.log(
                `Organization type: ${unifiedDto.organizationType}, Role: ${unifiedDto.role}`
            );

            const tokenData = this.usersService.getUserTokenData(req);

            const response: CustomResponseType<any> =
                await this.authService.companyRegister(
                    unifiedDto,
                    tokenData,
                    avatar
                );

            this.logger.log(`Registration response status: ${response.status}`);

            if (response.status !== 201) {
                this.logger.warn(`Registration failed: ${response.message}`);
            } else {
                this.logger.log(
                    `Registration successful for: ${unifiedDto.email}`
                );
            }

            return res.status(response.status).json(response);
        } catch (error) {
            this.logger.error(
                `Error in company registration: ${error.message}`
            );
            this.logger.error(error.stack);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Registration failed due to an unexpected error",
                payload: null,
            });
        }
    }

    @Post("register")
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: "Academy admin successfully created.",
    })
    async register(
        @Body(new NewInstancePipe(transferMapping)) registerDto: RegisterDto,
        @Req() req: Request,
        @Res() res: Response
    ): Promise<Response> {
        registerDto.role =
            registerDto.organizationType === "academy"
                ? UserRole.ACADEMY_ADMIN
                : UserRole.CLUB_ADMIN;

        const response: CustomResponseType<any> =
            await this.authService.register(
                registerDto,
                this.usersService.getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }

    @Post("forget_password")
    @ApiOperation({
        summary: "Request a password reset",
    })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: ForgetPasswordDto })
    async forgetPassword(
        @Body() body: ForgetPasswordDto,
        @Res() res: Response
    ) {
        const { email } = body;
        const response = await this.authService.forgetPassword(email);
        return res.status(response.status).json(response);
    }

    @Post("reset_password")
    @ApiOperation({
        summary: "Reset password using the token received via email",
    })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: ResetPasswordDto })
    async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
        const { token, password } = body;
        const response = await this.authService.resetPassword(token, password);
        return res.status(response.status).json(response);
    }
}
