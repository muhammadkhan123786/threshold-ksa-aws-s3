import { Body, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
    ApiParam,
} from "@nestjs/swagger";
import CustomResponseType from "src/types/customResponseType";
import { ControllerWrapper } from "src/decorators";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { User } from "src/entities/user.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/enums/users.enum";
import { Branch } from "src/entities/branch.entity";
import { BranchService } from "./branch.service";
import { CreateBranchDto } from "src/dto/branch/create-branch.dto";

@ApiTags("Branches")
@Roles(UserRole.ACADEMY_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("branches")
export class BranchController {
    constructor(private readonly branchService: BranchService) {}

    @Get()
    @ApiOperation({ summary: "Get all branches" })
    @ApiResponse({
        status: 200,
        description: "Branches fetched successfully",
        type: Branch,
        isArray: true,
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    async getBranches(@Res() res: Response, @GetUser() user: any) {
        const response: CustomResponseType<Branch[]> =
            await this.branchService.getBranches(user.payload.academy.id);
        return res.status(response.status).json(response);
    }

    @Post("create")
    @ApiOperation({ summary: "Create a new branch" })
    @ApiBody({ type: CreateBranchDto, description: "Branch details" })
    @ApiResponse({
        status: 201,
        description: "Branch created successfully",
        type: Branch,
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    async createBranch(
        @Body() createBranchDto: CreateBranchDto,
        @GetUser() user: User,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Branch> =
            await this.branchService.createBranch(user, createBranchDto);

        return res.status(response.status).json(response);
    }

    @Get(":branchId")
    @ApiOperation({ summary: "Get branch by ID" })
    @ApiParam({ name: "branchId", description: "The ID of the branch" })
    @ApiResponse({
        status: 200,
        description: "Branch fetched successfully",
        type: Branch,
    })
    @ApiResponse({
        status: 404,
        description: "Branch not found",
    })
    @ApiResponse({
        status: 500,
        description: "Internal server error",
    })
    async getBranchById(
        @Param("branchId") branchId: string,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Branch> =
            await this.branchService.getBranchById(branchId);
        return res.status(response.status).json(response);
    }
}
