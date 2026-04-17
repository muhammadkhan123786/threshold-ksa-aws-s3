import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
    ApiQuery,
    ApiConsumes,
    ApiBody,
} from "@nestjs/swagger";
import { Response } from "express";
import { DeleteResult } from "typeorm";
import { CreateAcademyDto } from "../../dto/academies/create-academy.dto";
import { Academy } from "../../entities/academy.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import CustomResponseType from "src/types/customResponseType";
import { UpdateClubDto } from "src/dto/club/update-club.dto";
import { ClubService } from "./club.service";
import {
    SWAGGER_TAGS,
    SWAGGER_OPERATIONS,
    SWAGGER_PARAMS,
    SWAGGER_RESPONSES,
    SWAGGER_BODIES,
} from "./swagger.constants";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateClubDto } from "src/dto/club/create-club.dto";

@ApiTags(SWAGGER_TAGS.CLUBS)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("club")
export class ClubController {
    constructor(private readonly clubsService: ClubService) {}

    @Get()
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUBS.summary })
    @ApiQuery(SWAGGER_PARAMS.SEARCH_QUERY)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUBS_SUCCESS)
    async getClubs(@Query("search") search: string, @Res() res: Response) {
        const response: CustomResponseType<Academy[]> =
            await this.clubsService.getClubs(search);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.GET_CLUB_BY_ID.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.GET_CLUB_BY_ID_SUCCESS)
    async getClubById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Academy> =
            await this.clubsService.getClubById(id);
        return res.status(response.status).json(response);
    }

    @Post()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("avatar"))
    @ApiOperation({ summary: SWAGGER_OPERATIONS.CREATE_CLUB.summary })
    @ApiBody(SWAGGER_BODIES.CREATE_CLUB)
    @ApiResponse(SWAGGER_RESPONSES.CREATE_CLUB_SUCCESS)
    async createClub(
        @Body() createDto: CreateClubDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Academy> =
            await this.clubsService.createClub(createDto, avatar);
        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("avatar"))
    @ApiOperation({ summary: SWAGGER_OPERATIONS.UPDATE_CLUB.summary })
    @ApiBody(SWAGGER_BODIES.UPDATE_CLUB)
    @ApiResponse(SWAGGER_RESPONSES.UPDATE_CLUB_SUCCESS)
    async updateClub(
        @Param("id") id: string,
        @Body() updateDto: UpdateClubDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response
    ) {
        const response = await this.clubsService.updateClub(
            id,
            updateDto,
            avatar
        );
        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: SWAGGER_OPERATIONS.DELETE_CLUB.summary })
    @ApiParam(SWAGGER_PARAMS.ID_PARAM)
    @ApiResponse(SWAGGER_RESPONSES.DELETE_CLUB_SUCCESS)
    async deleteClub(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.clubsService.deleteClub(id);
        return res.status(response.status).json(response);
    }
}
