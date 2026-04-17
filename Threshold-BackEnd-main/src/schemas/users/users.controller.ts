import {
    Body,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdateResult } from "typeorm";
import { Request, Response } from "express";
import { User } from "src/entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dto/users/create-user.dto";
import { UpdateUserDto } from "src/dto/users/update-user.dto";
import { UserFields } from "src/enums/tables-data.enum";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
} from "src/decorators";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { NewInstanceTransformer } from "src/types/app.type";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/enums/users.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { GetUser } from "src/auth/decorators/get-user.decorator";

const transferMapping: NewInstanceTransformer = {
    notification: "boolean",
};

@ControllerWrapper("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    @Get("admin-managers/:branchId")
    @ApiOperation({ summary: "Get all admin managers by branch ID" })
    @ApiResponse({
        status: 200,
        description: "Admin Managers fetched successfully.",
        type: [User],
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error.",
    })
    async getAdminManagerByID(
        @Param("branchId") branchId: string,
        @Res() res: Response
    ): Promise<Response> {
        const response: CustomResponseType<User[]> =
            await this.usersService.getAdminManagersByBranchAndAcademy(
                branchId
            );
        return res.status(response.status).json(response);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    @Post("admin-manager")
    @ApiOperation({ summary: "Create a new admin manager" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: "Admin Manager successfully created.",
        type: User,
    })
    @ApiResponse({
        status: 400,
        description: "Bad request.",
    })
    @ApiResponse({
        status: 403,
        description: "Unauthorized.",
    })
    async createAdminManager(
        @Body() createUserDto: CreateUserDto,
        @Req() req: Request,
        @Res() res: Response,
        @GetUser() user: any
    ): Promise<Response> {
        console.log("req", user);
        const response: CustomResponseType<User> =
            await this.usersService.createAdminManager(createUserDto, user);
        return res.status(response.status).json(response);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ACADEMY_ADMIN, UserRole.ADMIN_MANAGER)
    @Get("admin-managers")
    @ApiOperation({ summary: "Get all admin managers" })
    @ApiResponse({
        status: 200,
        description: "Admin Managers fetched successfully.",
        type: [User],
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error.",
    })
    async getAdminManagers(@Res() res: Response): Promise<Response> {
        const response: CustomResponseType<User[]> =
            await this.usersService.getAdminManagers();
        return res.status(response.status).json(response);
    }

    @Get()
    @GetAllByQuery({
        fieldsEnum: UserFields,
        descendants: [
            ...RELATIONS.user.oneToMany,
            ...RELATIONS.user.manyToOne,
            ...RELATIONS.user.manyToMany,
        ],
    })
    async getUsers(
        @Query(
            new GetAllPipe(UserFields, [
                ...RELATIONS.user.manyToOne,
                ...RELATIONS.user.manyToMany,
            ])
        )
        query: GetAllProps<UserFields>,
        @Res() res: Response
    ) {
        const response: CustomResponseType<any> =
            await this.usersService.getUsers(query);
        return res.status(response.status).json(response);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ACADEMY_COORDINATOR)
    @Get("pending-approvals")
    @ApiOperation({ summary: "Get users pending approval with pagination" })
    @ApiResponse({
        status: 200,
        description:
            "Users fetched successfully with pending approvals listed first.",
    })
    async getPendingApprovalUsers(@Res() res: Response) {
        const response = await this.usersService.getPendingApprovalUsers();
        return res.status(response.status).json(response);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ACADEMY_COORDINATOR)
    @Patch("toggle-approval/:id")
    @ApiOperation({ summary: "Toggle user approval status" })
    async toggleApprovalStatus(@Param("id") id: string, @Res() res: Response) {
        const response = await this.usersService.toggleApprovalStatus(id);
        return res.status(response.status).json(response);
    }
    @Get(":id")
    @ApiOperation({ summary: "get a single user using its ID" })
    async getUserById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<any> =
            await this.usersService.getUserById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateUserDto, "create a new user")
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: "User successfully created." })
    async createUser(
        @Body(new NewInstancePipe(transferMapping))
        createUserDto: CreateUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<User> =
            await this.usersService.createUser(
                createUserDto,
                this.usersService.getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateUserDto, "update a user")
    async updateUser(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateUserDto: UpdateUserDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.usersService.updateUser(
                id,
                updateUserDto,
                this.usersService.getUserTokenData(req)
            );

        return res.status(response.status).json(response);
    }
}
