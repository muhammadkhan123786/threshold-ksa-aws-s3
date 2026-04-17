import { AcademiesService } from "../academies/academies.service";
import { AthletesService } from "../athletes/athletes.service";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { AthleteProfile } from "../../entities/athleteProfile.entity";
import { CreateAthleteProfileDto } from "../../dto/athleteProfiles/create-athleteProfile.dto";
import { UpdateAthleteProfileDto } from "../../dto/athleteProfiles/update-athleteProfile.dto";
import { AthleteProfileFields } from "../../enums/tables-data.enum";
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

@Injectable()
export class AthleteProfilesService {
    constructor(
        @InjectRepository(AthleteProfile)
        private readonly athleteProfileRepository: Repository<AthleteProfile>,
        // ----- external services -----
        private readonly academiesService: AcademiesService,
        @Inject(forwardRef(() => AthletesService))
        private readonly athletesService: AthletesService
    ) {}

    // --- Basic REST APIs ---

    async getAthleteProfiles(
        query: GetAllProps<AthleteProfileFields>
    ): Promise<CustomResponseType<AthleteProfile[]>> {
        try {
            const findQuery = filteredGetQuery(query);

            const response =
                await this.athleteProfileRepository.find(findQuery);

            return foundRes(
                response.length
                    ? "AthleteProfiles have been found"
                    : "AthleteProfiles list is empty",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getAthleteProfileById(
        id: string
    ): Promise<CustomResponseType<AthleteProfile>> {
        try {
            const response = await this.athleteProfileRepository.findOneBy({
                id,
            });

            if (!response) return notFoundRes("AthleteProfile does not exist");

            return foundRes("AthleteProfile has been found", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createAthleteProfile(
        createAthleteProfileDto: CreateAthleteProfileDto
    ): Promise<CustomResponseType<AthleteProfile>> {
        try {
            const {
                academy: academyId,
                athlete: athleteId,
                ...rest
            } = createAthleteProfileDto;

            const athleteProfileObj = { ...rest };

            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                athleteProfileObj["academy"] = academy.payload;
            }

            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                athleteProfileObj["athlete"] = athlete.payload;
            }

            const newAthleteProfile =
                this.athleteProfileRepository.create(athleteProfileObj);
            const response =
                await this.athleteProfileRepository.save(newAthleteProfile);

            return newInstanceRes<AthleteProfile>(
                "AthleteProfile has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateAthleteProfile(
        id: string,
        updateAthleteProfileDto: UpdateAthleteProfileDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            const athleteProfile = await this.getAthleteProfileById(id);
            if (!athleteProfile) {
                return notFoundRes(`AthleteProfile does not exist`);
            }

            const {
                academy: academyId,
                athlete: athleteId,
                ...rest
            } = updateAthleteProfileDto;

            const athleteProfileObj = { ...rest };

            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                athleteProfileObj["academy"] = academy.payload;
            }

            if (athleteId) {
                const athlete =
                    await this.athletesService.getAthleteById(athleteId);
                if (athlete.status !== 200) {
                    return notFoundRes("Athlete doesn't exist");
                }
                athleteProfileObj["athlete"] = athlete.payload;
            }

            const response = await this.athleteProfileRepository.update(
                { id },
                athleteProfileObj
            );

            return newInstanceRes<UpdateResult>(
                "AthleteProfile has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllAthleteProfiles(): Promise<
        CustomResponseType<DeleteResult>
    > {
        try {
            const response = await this.athleteProfileRepository.query(
                `TRUNCATE TABLE "athlete_profile" CASCADE;`
            );

            return deletedRes("AthleteProfiles data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAthleteProfile(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.athleteProfileRepository.delete(id);

            if (!response) {
                return notFoundRes("AthleteProfile does not exist");
            }

            return deletedRes(
                "AthleteProfile has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
