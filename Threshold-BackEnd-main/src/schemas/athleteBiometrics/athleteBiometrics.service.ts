import { AthletesService } from "../athletes/athletes.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, DeleteResult, Repository, UpdateResult } from "typeorm";
import { AthleteBiometric } from "../../entities/athleteBiometric.entity";
import { CreateAthleteBiometricDto } from "../../dto/athleteBiometrics/create-athleteBiometric.dto";
import { UpdateAthleteBiometricDto } from "../../dto/athleteBiometrics/update-athleteBiometric.dto";
import { AthleteBiometricFields } from "../../enums/tables-data.enum";
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
import { AthleteBiometricDto } from "src/dto/athleteBiometrics/athlete-biometric.dto";
import dayjs from "dayjs";

@Injectable()
export class AthleteBiometricsService {
    constructor(
        @InjectRepository(AthleteBiometric)
        private readonly athleteBiometricRepository: Repository<AthleteBiometric>,
        // ----- external services -----
        private readonly athletesService: AthletesService
    ) {}

    // --- Basic REST APIs ---

    async getBiometricDataForPeriod(
        athleteId: string,
        startDate: string,
        endDate: string
    ): Promise<AthleteBiometricDto[]> {
        const biometricData = await this.athleteBiometricRepository.find({
            where: {
                athlete: { id: athleteId },
                date: Between(startDate, endDate),
            },
            order: { date: "ASC" },
        });

        return biometricData.map((data) => ({
            date: data.date,
            bmi: parseFloat(data.bmi).toFixed(2),
            weight: parseFloat(data.weight).toFixed(2),
            height: parseFloat(data.height).toFixed(2),
        }));
    }

    async getAthleteBiometrics(
        query: GetAllProps<AthleteBiometricFields>
    ): Promise<CustomResponseType<AthleteBiometric[]>> {
        try {
            const findQuery = filteredGetQuery(query);
            const response =
                await this.athleteBiometricRepository.find(findQuery);

            return foundRes(
                response.length
                    ? "AthleteBiometrics have been found"
                    : "AthleteBiometrics list is empty",
                response,
                response.length
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getAthleteBiometricById(
        id: string
    ): Promise<CustomResponseType<AthleteBiometric>> {
        try {
            const response = await this.athleteBiometricRepository.findOneBy({
                id,
            });

            if (!response)
                return notFoundRes("AthleteBiometric does not exist");

            return foundRes("AthleteBiometric has been found", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createAthleteBiometric(
        createAthleteBiometricDto: CreateAthleteBiometricDto
    ): Promise<CustomResponseType<AthleteBiometric>> {
        try {
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_CREATE ---
                athlete: athleteId,
                ...rest
            } = createAthleteBiometricDto;

            const athleteBiometricObj = { ...rest };

            // --- Table ID check - create ---
            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                athleteBiometricObj["athlete"] = athlete.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const newAthleteBiometric =
                this.athleteBiometricRepository.create(athleteBiometricObj);
            const response =
                await this.athleteBiometricRepository.save(newAthleteBiometric);
            // --- Post-response - create ---

            // ----------------------
            // return the response
            return newInstanceRes<AthleteBiometric>(
                "AthleteBiometric has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateAthleteBiometric(
        id: string,
        updateAthleteBiometricDto: UpdateAthleteBiometricDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            // check if the id exists
            const athleteBiometric = await this.getAthleteBiometricById(id);
            if (!athleteBiometric) {
                return notFoundRes(`AthleteBiometric does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                athlete: athleteId,
                ...rest
            } = updateAthleteBiometricDto;

            const athleteBiometricObj = { ...rest };

            // --- Table ID check - update ---
            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                athleteBiometricObj["athlete"] = athlete.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const response = await this.athleteBiometricRepository.update(
                {
                    id,
                },
                athleteBiometricObj
            );
            // --- Post-response - update ---

            // ----------------------
            // return the response
            return newInstanceRes<UpdateResult>(
                "AthleteBiometric has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllAthleteBiometrics(): Promise<
        CustomResponseType<DeleteResult>
    > {
        try {
            const response = await this.athleteBiometricRepository.query(
                `TRUNCATE TABLE "athlete_biometric" CASCADE;`
            );

            return deletedRes("AthleteBiometrics data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAthleteBiometric(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.athleteBiometricRepository.delete(id);

            if (!response) {
                return notFoundRes("AthleteBiometric does not exist");
            }

            return deletedRes(
                "AthleteBiometric has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
