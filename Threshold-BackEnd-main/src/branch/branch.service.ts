import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import {
    errorRes,
    foundRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import CustomResponseType from "src/types/customResponseType";
import { Branch } from "src/entities/branch.entity";
import { I18nService } from "src/i18n/i18n.service";
import { User } from "src/entities/user.entity";
import { CreateBranchDto } from "src/dto/branch/create-branch.dto";
import { Academy } from "src/entities/academy.entity";

@Injectable()
export class BranchService {
    constructor(
        @InjectRepository(Branch)
        private readonly branchRepository: Repository<Branch>,
        private readonly i18nService: I18nService
    ) {}

    async getBranches(
        academyId: string
    ): Promise<CustomResponseType<Branch[]>> {
        try {
            const branches = await this.branchRepository.find({
                relations: ["athletes", "teams", "coaches"],
                where: {
                    academy: { id: academyId },
                },

                select: {
                    athletes: {
                        id: true,
                    },
                    teams: {
                        id: true,
                    },
                    coaches: {
                        id: true,
                    },
                },
            });
            return foundRes(
                this.i18nService.translate("branches.fetched_successfully"),
                branches
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async createBranch(
        user: User,
        createBranchDto: CreateBranchDto
    ): Promise<CustomResponseType<Branch>> {
        try {
            const res = await this.branchRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    const userWithAcademy =
                        await transactionalEntityManager.findOne(User, {
                            where: { id: (user as any)?.payload?.id },
                            relations: ["academy"],
                        });

                    if (!userWithAcademy) {
                        return notFoundRes(
                            this.i18nService.translate("academy.not_found")
                        );
                    }

                    const newBranch = transactionalEntityManager.create(
                        Branch,
                        {
                            ...createBranchDto,
                            academy: userWithAcademy.academy,
                            createdBy: user,
                        }
                    );

                    const savedBranch = await transactionalEntityManager.save(
                        Branch,
                        newBranch
                    );

                    return foundRes(
                        this.i18nService.translate(
                            "branches.created_successfully"
                        ),
                        savedBranch
                    );
                }
            );

            return res;
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async getBranchById(branchId: string): Promise<CustomResponseType<Branch>> {
        try {
            const branch = await this.branchRepository.findOne({
                where: { id: branchId },
                relations: [
                    "athletes",
                    "teams",
                    "coaches",
                    "athletes.subscription",
                    "athletes.athleteProfiles",
                    "coaches.teams",
                ],
                select: {
                    coaches: {
                        id: true,
                        birthday: true,
                        firstName: true,
                        lastName: true,
                        sport: true,
                        teams: {
                            id: true,
                        },
                    },
                    athletes: {
                        id: true,
                        dateOfBirth: true,
                        firstName: true,
                        lastName: true,
                        subscription: {
                            status: true,
                            id: true,
                        },
                        athleteProfiles: {
                            id: true,
                            sport: true,
                            status: true,
                        },
                    },
                    teams: {
                        id: true,
                        name: true,
                        sport: true,
                        athletes: {
                            id: true,
                        },
                    },
                },
            });

            if (!branch) {
                throw new NotFoundException(
                    this.i18nService.translate("branches.not_found")
                );
            }

            return foundRes(
                this.i18nService.translate("branches.fetched_successfully"),
                branch
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    private handleErrorWithTranslation(error: any): CustomResponseType<any> {
        console.error(error);

        const errorMessage = error?.response?.message || error.message;

        if (errorMessage) {
            return errorRes(errorMessage);
        }

        if (error instanceof NotFoundException) {
            return errorRes(this.i18nService.translate("branches.not_found"));
        } else if (error instanceof InternalServerErrorException) {
            return errorRes(
                this.i18nService.translate("auth.internal_server_error")
            );
        } else {
            return errorRes(this.i18nService.translate("auth.unknown_error"));
        }
    }
}
