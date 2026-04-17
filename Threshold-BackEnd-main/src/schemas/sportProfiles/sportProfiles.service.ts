import { AcademiesService } from "../academies/academies.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { SportProfile } from "../../entities/sportProfile.entity";
import { CreateSportProfileDto } from "../../dto/sportProfiles/create-sportProfile.dto";
import { UpdateSportProfileDto } from "../../dto/sportProfiles/update-sportProfile.dto";
import { SportProfileFields } from "../../enums/tables-data.enum";
import { filteredGetQuery } from "src/middlewares/filters";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";

@Injectable()
export class SportProfilesService {
    constructor(
        @InjectRepository(SportProfile)
        private readonly sportProfileRepository: Repository<SportProfile>,
        // ----- external services -----
        private readonly academiesService: AcademiesService
    ) {}

    // --- Basic REST APIs ---

    async getSportProfiles(
        query: GetAllProps<SportProfileFields>
    ): Promise<CustomResponseType<SportProfile[]>> {
        try {
            const findQuery = filteredGetQuery(query);
            const response = await this.sportProfileRepository.find(findQuery);

            return foundRes(
                response.length
                    ? "SportProfiles have been found"
                    : "SportProfiles list is empty",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getSportProfileById(
        id: string
    ): Promise<CustomResponseType<SportProfile>> {
        try {
            const response = await this.sportProfileRepository.findOneBy({
                id,
            });

            if (!response) return notFoundRes("SportProfile does not exist");

            return foundRes("SportProfile has been found", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createSportProfile(
        createSportProfileDto: CreateSportProfileDto
    ): Promise<CustomResponseType<SportProfile>> {
        try {
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_CREATE ---
                academy: academyId,
                ...rest
            } = createSportProfileDto;

            const sportProfileObj = { ...rest };

            // --- Table ID check - create ---
            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                sportProfileObj["academy"] = academy.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const newSportProfile =
                this.sportProfileRepository.create(sportProfileObj);
            const response =
                await this.sportProfileRepository.save(newSportProfile);
            // --- Post-response - create ---

            // ----------------------
            // return the response
            return newInstanceRes<SportProfile>(
                "SportProfile has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateSportProfile(
        id: string,
        updateSportProfileDto: UpdateSportProfileDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            // check if the id exists
            const sportProfile = await this.getSportProfileById(id);
            if (!sportProfile) {
                return notFoundRes(`SportProfile does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                academy: academyId,
                ...rest
            } = updateSportProfileDto;

            const sportProfileObj = { ...rest };

            // --- Table ID check - update ---
            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                sportProfileObj["academy"] = academy.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const response = await this.sportProfileRepository.update(
                {
                    id,
                },
                sportProfileObj
            );
            // --- Post-response - update ---

            // ----------------------
            // return the response
            return newInstanceRes<UpdateResult>(
                "SportProfile has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllSportProfiles(): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.sportProfileRepository.query(
                `TRUNCATE TABLE "sport_profile" CASCADE;`
            );

            return deletedRes("SportProfiles data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteSportProfile(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.sportProfileRepository.delete(id);

            if (!response) {
                return notFoundRes("SportProfile does not exist");
            }

            return deletedRes(
                "SportProfile has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    // --- Relational REST APIs ---
}
