import { UsersService } from "../users/users.service";
import {
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import CustomResponseType from "src/types/customResponseType";
import { GetAllProps } from "src/types/getOperators";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import { filteredGetQuery } from "src/middlewares/filters";
import { Academy } from "../../entities/academy.entity";
import { CreateAcademyDto } from "../../dto/academies/create-academy.dto";
import { UpdateAcademyDto } from "../../dto/academies/update-academy.dto";
import { AcademyFields } from "../../enums/tables-data.enum";

@Injectable()
export class AcademiesService {
    constructor(
        @InjectRepository(Academy)
        private readonly academyRepository: Repository<Academy>
    ) {}

    // --- Basic REST APIs ---

    async getAcademies(
        query: GetAllProps<AcademyFields>
    ): Promise<CustomResponseType<Academy[]>> {
        try {
            const findQuery = filteredGetQuery(query);

            const response = await this.academyRepository.find(findQuery);

            return foundRes(
                response.length
                    ? "Academies have been found"
                    : "Academies list is empty",
                response,
                response.length
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getAcademyById(id: string): Promise<CustomResponseType<Academy>> {
        try {
            const response = await this.academyRepository.findOneBy({ id });

            if (!response) return notFoundRes("Academy does not exist");

            return foundRes("Academy has been found", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getAcademyByUserId(userId: string): Promise<Academy> {
        const academy = await this.academyRepository
            .createQueryBuilder("academy")
            .innerJoin("academy.users", "user", "user.id = :userId", { userId })
            .getOne();

        if (!academy) {
            throw new NotFoundException("Academy not found");
        }

        return academy;
    }

    async createAcademy(
        createAcademyDto: CreateAcademyDto
    ): Promise<CustomResponseType<Academy>> {
        try {
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_CREATE ---
                ...rest
            } = createAcademyDto;

            const academyObj = { ...rest };

            // ----------------------

            // create the object and save it in the DB
            const newAcademy = this.academyRepository.create(academyObj);
            const response = await this.academyRepository.save(newAcademy);
            // --- Post-response - create ---

            // ----------------------
            // return the response
            return newInstanceRes<Academy>(
                "Academy has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async updateAcademy(
        id: string,
        updateAcademyDto: UpdateAcademyDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            // check if the id exists
            const academy = await this.getAcademyById(id);
            if (!academy) {
                return notFoundRes(`Academy does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                ...rest
            } = updateAcademyDto;

            const academyObj = { ...rest };

            // ----------------------

            // create the object and save it in the DB
            const response = await this.academyRepository.update(
                {
                    id,
                },
                academyObj
            );
            // --- Post-response - update ---

            // ----------------------
            // return the response
            return newInstanceRes<UpdateResult>(
                "Academy has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAcademy(id: string): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.academyRepository.delete(id);

            if (!response) {
                return notFoundRes("Academy does not exist");
            }

            return deletedRes(
                "Academy has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllAcademies(): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.academyRepository.query(
                `TRUNCATE TABLE "academy" CASCADE;`
            );

            return deletedRes("Academies data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
