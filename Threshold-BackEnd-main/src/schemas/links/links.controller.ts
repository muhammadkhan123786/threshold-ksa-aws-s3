import { Body, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { LinksService } from "./links.service";
import CustomResponseType from "src/types/customResponseType";
import { EditorsWrapper, ControllerWrapper } from "src/decorators";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { CreatePublicAthleteLinkDto } from "src/dto/public/create-publicLink.dto";
import { User } from "src/entities/user.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/enums/users.enum";
import { PublicLink } from "src/entities/publicLink.entity";

@ControllerWrapper("links")
export class LinksController {
    constructor(private readonly linksService: LinksService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ACADEMY_COORDINATOR)
    @Get()
    async getPublicLinks(@Res() res: Response) {
        const response: CustomResponseType<PublicLink[]> =
            await this.linksService.getPublicLinks();
        return res.status(response.status).json(response);
    }

    @Post("create-public-athlete-link")
    @EditorsWrapper(
        CreatePublicAthleteLinkDto,
        "create a new public athlete link"
    )
    async createPublicAthleteLink(
        @Body() createPublicAthleteLinkDto: CreatePublicAthleteLinkDto,
        @GetUser() user: User,
        @Res() res: Response
    ) {
        const response: CustomResponseType<PublicLink> =
            await this.linksService.createPublicAthleteLink(
                user,
                createPublicAthleteLinkDto
            );

        return res.status(response.status).json(response);
    }

    @Get("check/:academyId/:deviceIdentifier")
    async checkPublicAthleteLink(
        @Param("academyId") academyId: string,
        @Param("deviceIdentifier") deviceIdentifier: string,
        @Res() res: Response
    ) {
        const response: CustomResponseType<boolean> =
            await this.linksService.checkPublicAthleteLinkExists(
                academyId,
                deviceIdentifier
            );
        return res.status(response.status).json(response);
    }
}
