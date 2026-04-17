import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { SportProfilesService } from "./sportProfiles.service";
import { SportProfile } from "../../entities/sportProfile.entity";
import { CreateSportProfileDto } from "../../dto/sportProfiles/create-sportProfile.dto";
import { UpdateSportProfileDto } from "../../dto/sportProfiles/update-sportProfile.dto";
import { SportProfileFields } from "../../enums/tables-data.enum";
import {
    ControllerWrapper,
    EditorsWrapper,
    GetAllByQuery,
} from "src/decorators";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { NewInstanceTransformer } from "src/types/app.type";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";

const transferMapping: NewInstanceTransformer = {};

@ControllerWrapper("sportProfiles")
export class SportProfilesController {
    constructor(private readonly sportProfilesService: SportProfilesService) {}

    // --- Basic REST endpoints ---

    @Get()
    @GetAllByQuery({
        fieldsEnum: SportProfileFields,
        descendants: [
            ...RELATIONS.sportProfile.oneToMany,
            ...RELATIONS.sportProfile.manyToOne,
            ...RELATIONS.sportProfile.manyToMany,
        ],
    })
    async getSportProfiles(
        @Query(
            new GetAllPipe(SportProfileFields, [
                ...RELATIONS.sportProfile.manyToOne,
                ...RELATIONS.sportProfile.manyToMany,
            ])
        )
        query: GetAllProps<SportProfileFields>,
        @Res() res: Response
    ) {
        const response: CustomResponseType<SportProfile[]> =
            await this.sportProfilesService.getSportProfiles(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single sportProfile using its ID" })
    async getSportProfileById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<SportProfile> =
            await this.sportProfilesService.getSportProfileById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateSportProfileDto, "create a new sportProfile")
    async createSportProfile(
        @Body(new NewInstancePipe(transferMapping))
        createSportProfileDto: CreateSportProfileDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<SportProfile> =
            await this.sportProfilesService.createSportProfile(
                createSportProfileDto
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateSportProfileDto, "update a sportProfile")
    async updateSportProfile(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateSportProfileDto: UpdateSportProfileDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.sportProfilesService.updateSportProfile(
                id,
                updateSportProfileDto
            );

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @ApiOperation({ summary: "delete all sportProfiles" })
    async deleteAllSportProfiles(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.sportProfilesService.deleteAllSportProfiles();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a sportProfile" })
    async deleteSportProfile(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.sportProfilesService.deleteSportProfile(id);

        return res.status(response.status).json(response);
    }

    // --- Relational REST endpoints ---
}
