import { AthletesService } from "../athletes/athletes.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { AthleteBattery } from "../../entities/athleteBattery.entity";
import { CreateAthleteBatteryDto } from "../../dto/athleteBatteries/create-athleteBattery.dto";
import { UpdateAthleteBatteryDto } from "../../dto/athleteBatteries/update-athleteBattery.dto";
import { AthleteBatteryFields } from "../../enums/tables-data.enum";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { filteredGetQuery } from "src/middlewares/filters";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import moment from "moment";
import { AllFitnessTestResultDto } from "src/dto/athleteBatteries/fitness-test-result.dto";

@Injectable()
export class AthleteBatteriesService {
    constructor(
        @InjectRepository(AthleteBattery)
        private readonly athleteBatteryRepository: Repository<AthleteBattery>,
        // ----- external services -----
        private readonly athletesService: AthletesService
    ) {}

    async getAthleteAndTeamFitnessData(
        athleteId: string,
        testType: string,
        startDate: string = moment().subtract(6, "months").toISOString(),
        endDate: string = moment().toISOString(),
        interval: string = "15 days"
    ): Promise<{
        athleteData: AllFitnessTestResultDto[];
        teamAverageData: AllFitnessTestResultDto[];
    }> {
        const columnMapping = {
            push: "push",
            curl: "curl",
            trunk: "trunk",
            sit: "sit",
            pacer: "pacer",
        };

        let selectedColumns: string;
        let queryParams: any[] = [startDate, endDate, athleteId];

        if (testType === "all") {
            selectedColumns = Object.values(columnMapping)
                .map(
                    (
                        col
                    ) => `ROUND(CAST(COALESCE(AVG(CAST(ab.${col} AS FLOAT)), 0) AS NUMERIC), 1) AS athlete_${col}, 
                               ROUND(CAST(COALESCE(AVG(CAST(tb.${col} AS FLOAT)), 0) AS NUMERIC), 1) AS team_${col}`
                )
                .join(", ");
        } else {
            const selectedColumn = columnMapping[testType];
            if (!selectedColumn) {
                throw new Error("Invalid test type specified.");
            }

            selectedColumns = `ROUND(CAST(COALESCE(AVG(CAST(ab.${selectedColumn} AS FLOAT)), 0) AS NUMERIC), 1) AS athlete_value, 
                               ROUND(CAST(COALESCE(AVG(CAST(tb.${selectedColumn} AS FLOAT)), 0) AS NUMERIC), 1) AS team_value`;
        }

        const query = `
            WITH date_series AS (
                SELECT 
                    generate_series($1::timestamp, $2::timestamp, interval '${interval}') AS period_start
            )
            SELECT 
                ds.period_start AS date,
                ${selectedColumns}
            FROM 
                date_series ds
            LEFT JOIN athlete_battery ab ON 
                ab.date::timestamp >= ds.period_start 
                AND ab.date::timestamp < ds.period_start + interval '${interval}'
                AND ab."athleteId" = $3
            LEFT JOIN athlete_battery tb ON 
                tb.date::timestamp >= ds.period_start 
                AND tb.date::timestamp < ds.period_start + interval '${interval}'
            GROUP BY 
                ds.period_start
            ORDER BY 
                ds.period_start ASC;
        `;

        const results = await this.athleteBatteryRepository.query(
            query,
            queryParams
        );

        if (testType === "all") {
            const athleteData = results.map((result, index) => ({
                id: index + 1,
                date: result.date,
                pacer: result.athlete_pacer,
                sit: result.athlete_sit,
                trunk: result.athlete_trunk,
                push: result.athlete_push,
                curl: result.athlete_curl,
            }));

            const teamAverageData = results.map((result, index) => ({
                id: index + 1,
                date: result.date,
                pacer: result.team_pacer,
                sit: result.team_sit,
                trunk: result.team_trunk,
                push: result.team_push,
                curl: result.team_curl,
            }));

            return { athleteData, teamAverageData };
        } else {
            const athleteData = results.map((result, index) => ({
                id: index + 1,
                date: result.date,
                value: parseFloat(result.athlete_value),
                testType,
            }));

            const teamAverageData = results.map((result, index) => ({
                id: index + 1,
                date: result.date,
                value: parseFloat(result.team_value),
                testType,
            }));

            return { athleteData, teamAverageData };
        }
    }

    async getAthleteBatteries(
        query: GetAllProps<AthleteBatteryFields>
    ): Promise<CustomResponseType<AthleteBattery[]>> {
        try {
            const findQuery = filteredGetQuery(query);
            const response =
                await this.athleteBatteryRepository.find(findQuery);

            return foundRes(
                response.length
                    ? "AthleteBatteries have been found"
                    : "AthleteBatteries list is empty",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getAthleteBatteryById(
        id: string
    ): Promise<CustomResponseType<AthleteBattery>> {
        try {
            const response = await this.athleteBatteryRepository.findOneBy({
                id,
            });

            if (!response) return notFoundRes("AthleteBattery does not exist");

            return foundRes("AthleteBattery has been found", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createAthleteBattery(
        createAthleteBatteryDto: CreateAthleteBatteryDto
    ): Promise<CustomResponseType<AthleteBattery>> {
        try {
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_CREATE ---
                athlete: athleteId,
                ...rest
            } = createAthleteBatteryDto;

            const athleteBatteryObj = { ...rest };

            // --- Table ID check - create ---
            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                athleteBatteryObj["athlete"] = athlete.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const newAthleteBattery =
                this.athleteBatteryRepository.create(athleteBatteryObj);
            const response =
                await this.athleteBatteryRepository.save(newAthleteBattery);
            // --- Post-response - create ---

            // ----------------------
            // return the response
            return newInstanceRes<AthleteBattery>(
                "AthleteBattery has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateAthleteBattery(
        id: string,
        updateAthleteBatteryDto: UpdateAthleteBatteryDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            // check if the id exists
            const athleteBattery = await this.getAthleteBatteryById(id);
            if (!athleteBattery) {
                return notFoundRes(`AthleteBattery does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                athlete: athleteId,
                ...rest
            } = updateAthleteBatteryDto;

            const athleteBatteryObj = { ...rest };

            // --- Table ID check - update ---
            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                athleteBatteryObj["athlete"] = athlete.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const response = await this.athleteBatteryRepository.update(
                {
                    id,
                },
                athleteBatteryObj
            );
            // --- Post-response - update ---

            // ----------------------
            // return the response
            return newInstanceRes<UpdateResult>(
                "AthleteBattery has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllAthleteBatteries(): Promise<
        CustomResponseType<DeleteResult>
    > {
        try {
            const response = await this.athleteBatteryRepository.query(
                `TRUNCATE TABLE "athlete_battery" CASCADE;`
            );

            return deletedRes("AthleteBatteries data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAthleteBattery(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.athleteBatteryRepository.delete(id);

            if (!response) {
                return notFoundRes("AthleteBattery does not exist");
            }

            return deletedRes(
                "AthleteBattery has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
