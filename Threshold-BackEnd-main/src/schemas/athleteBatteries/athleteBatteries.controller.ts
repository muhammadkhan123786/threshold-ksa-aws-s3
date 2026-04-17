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
import { ApiBody, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { AthleteBatteriesService } from "./athleteBatteries.service";
import { AthleteBattery } from "../../entities/athleteBattery.entity";
import { CreateAthleteBatteryDto } from "../../dto/athleteBatteries/create-athleteBattery.dto";
import { UpdateAthleteBatteryDto } from "../../dto/athleteBatteries/update-athleteBattery.dto";
import { AthleteBatteryFields } from "../../enums/tables-data.enum";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
} from "src/decorators";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { RELATIONS } from "src/lib/constants/table-relations";
import { FitnessTestQueryDto } from "src/dto/athleteBatteries/fitness-test-query";
import { IntervalEnum, TestTypeEnum } from "src/enums/athletes.enum";
import { AllFitnessTestResultDto } from "src/dto/athleteBatteries/fitness-test-result.dto";

const transferMapping: NewInstanceTransformer = {
    curl: "number",
    date: "date",
    pacer: "number",
    push: "number",
    sit: "number",
    trunk: "number",
};

@ControllerWrapper("athleteBatteries")
export class AthleteBatteriesController {
    constructor(
        private readonly athleteBatteriesService: AthleteBatteriesService
    ) {}

    // --- Basic REST endpoints ---

    @Get()
    @GetAllByQuery({
        fieldsEnum: AthleteBatteryFields,
        descendants: [
            ...RELATIONS.athleteBattery.oneToMany,
            ...RELATIONS.athleteBattery.manyToOne,
            ...RELATIONS.athleteBattery.manyToMany,
        ],
    })
    async getAthleteBatteries(
        @Query(
            new GetAllPipe(AthleteBatteryFields, [
                ...RELATIONS.athleteBattery.manyToOne,
                ...RELATIONS.athleteBattery.manyToMany,
            ])
        )
        query: GetAllProps<AthleteBatteryFields>,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteBattery[]> =
            await this.athleteBatteriesService.getAthleteBatteries(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single athleteBattery using its ID" })
    async getAthleteBatteryById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<AthleteBattery> =
            await this.athleteBatteriesService.getAthleteBatteryById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateAthleteBatteryDto, "create a new athleteBattery")
    async createAthleteBattery(
        @Body(new NewInstancePipe(transferMapping))
        createAthleteBatteryDto: CreateAthleteBatteryDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteBattery> =
            await this.athleteBatteriesService.createAthleteBattery(
                createAthleteBatteryDto
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateAthleteBatteryDto, "update a athleteBattery")
    async updateAthleteBattery(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateAthleteBatteryDto: UpdateAthleteBatteryDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.athleteBatteriesService.updateAthleteBattery(
                id,
                updateAthleteBatteryDto
            );

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @ApiOperation({ summary: "delete all athleteBatteries" })
    async deleteAllAthleteBatteries(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.athleteBatteriesService.deleteAllAthleteBatteries();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a athleteBattery" })
    async deleteAthleteBattery(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.athleteBatteriesService.deleteAthleteBattery(id);

        return res.status(response.status).json(response);
    }

    @Get(":athleteId/fitness-data")
    @ApiOperation({
        summary: "Get fitness data for a specific athlete",
        description:
            "Retrieve fitness test data for a specific athlete over a customizable period, grouped by customizable intervals. This also includes the team average for the same periods.",
    })
    @ApiQuery({
        name: "testType",
        required: false,
        description:
            "The type of fitness test (e.g., push, curl, trunk, sit, pacer). Use 'all' to get all fitness test types.",
        example: "all",
    })
    @ApiQuery({
        name: "startDate",
        required: false,
        description:
            "The start date for the data retrieval period (ISO 8601 format)",
        example: "2024-01-01T00:00:00.000Z",
    })
    @ApiQuery({
        name: "endDate",
        required: false,
        description:
            "The end date for the data retrieval period (ISO 8601 format)",
        example: "2024-07-01T00:00:00.000Z",
    })
    @ApiQuery({
        name: "interval",
        required: false,
        description:
            "The interval for grouping data (e.g., '15 days', '1 month')",
        example: "15 days",
    })
    @ApiResponse({
        status: 200,
        description:
            "Successfully retrieved fitness test data and team average data",
        type: AllFitnessTestResultDto,
        isArray: true,
    })
    async getFitnessDataForLastSixMonths(
        @Param("athleteId") athleteId: string,
        @Query() query: FitnessTestQueryDto
    ): Promise<{
        athleteData: AllFitnessTestResultDto[];
        teamAverageData: AllFitnessTestResultDto[];
    }> {
        const { testType = "all", startDate, endDate, interval } = query;

        return await this.athleteBatteriesService.getAthleteAndTeamFitnessData(
            athleteId,
            testType,
            startDate,
            endDate,
            interval
        );
    }
}
