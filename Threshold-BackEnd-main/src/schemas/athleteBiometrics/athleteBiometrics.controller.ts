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
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { AthleteBiometricsService } from "./athleteBiometrics.service";
import { AthleteBiometric } from "../../entities/athleteBiometric.entity";
import { CreateAthleteBiometricDto } from "../../dto/athleteBiometrics/create-athleteBiometric.dto";
import { UpdateAthleteBiometricDto } from "../../dto/athleteBiometrics/update-athleteBiometric.dto";
import { AthleteBiometricFields } from "../../enums/tables-data.enum";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
} from "src/decorators";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { NewInstanceTransformer } from "src/types/app.type";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { RELATIONS } from "src/lib/constants/table-relations";
import { AthleteBiometricDto } from "src/dto/athleteBiometrics/athlete-biometric.dto";

const transferMapping: NewInstanceTransformer = {
    date: "date",
};

@ControllerWrapper("athleteBiometrics")
export class AthleteBiometricsController {
    constructor(
        private readonly athleteBiometricsService: AthleteBiometricsService
    ) {}

    // --- Basic REST endpoints ---

    @Get(":athleteId/body-composition")
    @ApiOperation({
        summary: "Get body composition data for a specific period",
        description:
            "Retrieve biometric data for a specific athlete over a customizable period defined by start and end dates.",
    })
    @ApiQuery({
        name: "startDate",
        required: true,
        description:
            "The start date for the data retrieval period (ISO 8601 format)",
        example: "2024-01-01T00:00:00.000Z",
    })
    @ApiQuery({
        name: "endDate",
        required: true,
        description:
            "The end date for the data retrieval period (ISO 8601 format)",
        example: "2024-06-30T23:59:59.999Z",
    })
    @ApiResponse({
        status: 200,
        description:
            "Successfully retrieved biometric data for the specified period",
        type: [AthleteBiometricDto],
    })
    async getBodyCompositionForPeriod(
        @Param("athleteId") athleteId: string,
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string
    ): Promise<AthleteBiometricDto[]> {
        return await this.athleteBiometricsService.getBiometricDataForPeriod(
            athleteId,
            startDate,
            endDate
        );
    }

    @Get()
    @GetAllByQuery({
        fieldsEnum: AthleteBiometricFields,
        descendants: [
            ...RELATIONS.athleteBiometric.oneToMany,
            ...RELATIONS.athleteBiometric.manyToMany,
        ],
    })
    async getAthleteBiometrics(
        @Query(
            new GetAllPipe(AthleteBiometricFields, [
                ...RELATIONS.athleteBiometric.manyToOne,
                ...RELATIONS.athleteBiometric.manyToOne,
                ...RELATIONS.athleteBiometric.manyToMany,
            ])
        )
        query: GetAllProps<AthleteBiometricFields>,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteBiometric[]> =
            await this.athleteBiometricsService.getAthleteBiometrics(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    // @MembersOnly()
    @ApiOperation({ summary: "get a single athleteBiometric using its ID" })
    async getAthleteBiometricById(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteBiometric> =
            await this.athleteBiometricsService.getAthleteBiometricById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    // @MembersOnly()
    @EditorsWrapper(CreateAthleteBiometricDto, "create a new athleteBiometric")
    async createAthleteBiometric(
        @Body(new NewInstancePipe(transferMapping))
        createAthleteBiometricDto: CreateAthleteBiometricDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteBiometric> =
            await this.athleteBiometricsService.createAthleteBiometric(
                createAthleteBiometricDto
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    // @MembersOnly()
    @EditorsWrapper(UpdateAthleteBiometricDto, "update a athleteBiometric")
    async updateAthleteBiometric(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateAthleteBiometricDto: UpdateAthleteBiometricDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.athleteBiometricsService.updateAthleteBiometric(
                id,
                updateAthleteBiometricDto
            );

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    // @AdminsOnly()
    @ApiOperation({ summary: "delete all athleteBiometrics" })
    async deleteAllAthleteBiometrics(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.athleteBiometricsService.deleteAllAthleteBiometrics();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    // @MembersOnly()
    @ApiOperation({ summary: "delete a athleteBiometric" })
    async deleteAthleteBiometric(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        const response: CustomResponseType<DeleteResult> =
            await this.athleteBiometricsService.deleteAthleteBiometric(id);

        return res.status(response.status).json(response);
    }
}
