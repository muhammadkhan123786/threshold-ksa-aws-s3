import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { AthleteProfilesService } from "./athleteProfiles.service";
import { AthleteProfile } from "../../entities/athleteProfile.entity";
import { CreateAthleteProfileDto } from "../../dto/athleteProfiles/create-athleteProfile.dto";
import { UpdateAthleteProfileDto } from "../../dto/athleteProfiles/update-athleteProfile.dto";
import { AthleteProfileFields } from "../../enums/tables-data.enum";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
} from "src/decorators";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

const transferMapping: NewInstanceTransformer = {
    // column: "columnType",
};

@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("athleteProfiles")
export class AthleteProfilesController {
    constructor(
        private readonly athleteProfilesService: AthleteProfilesService
    ) {}

    // --- Basic REST endpoints ---

    @Get()
    @GetAllByQuery({
        fieldsEnum: AthleteProfileFields,
        descendants: [
            ...RELATIONS.athleteProfile.oneToMany,
            ...RELATIONS.athleteProfile.manyToOne,
            ...RELATIONS.athleteProfile.manyToMany,
        ],
    })
    async getAthleteProfiles(
        @Query(
            new GetAllPipe(AthleteProfileFields, [
                ...RELATIONS.athleteProfile.manyToOne,
                ...RELATIONS.athleteProfile.manyToMany,
            ])
        )
        query: GetAllProps<AthleteProfileFields>,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteProfile[]> =
            await this.athleteProfilesService.getAthleteProfiles(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single athleteProfile using its ID" })
    async getAthleteProfileById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<AthleteProfile> =
            await this.athleteProfilesService.getAthleteProfileById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateAthleteProfileDto, "create a new athleteProfile")
    async createAthleteProfile(
        @Body(new NewInstancePipe(transferMapping))
        createAthleteProfileDto: CreateAthleteProfileDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteProfile> =
            await this.athleteProfilesService.createAthleteProfile(
                createAthleteProfileDto
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateAthleteProfileDto, "update a athleteProfile")
    async updateAthleteProfile(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateAthleteProfileDto: UpdateAthleteProfileDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.athleteProfilesService.updateAthleteProfile(
                id,
                updateAthleteProfileDto
            );

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @ApiOperation({ summary: "delete all athleteProfiles" })
    async deleteAllAthleteProfiles(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.athleteProfilesService.deleteAllAthleteProfiles();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a athleteProfile" })
    async deleteAthleteProfile(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.athleteProfilesService.deleteAthleteProfile(id);

        return res.status(response.status).json(response);
    }
}
