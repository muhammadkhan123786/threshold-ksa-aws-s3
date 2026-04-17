import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import {
    errorRes,
    forbiddenRes,
    foundRes,
} from "src/lib/responses/restResponse";
import CustomResponseType from "src/types/customResponseType";
import { User } from "src/entities/user.entity";
import { CreatePublicAthleteLinkDto } from "src/dto/public/create-publicLink.dto";
import { PublicLink } from "src/entities/publicLink.entity";
import { I18nService } from "src/i18n/i18n.service";
import { Academy } from "src/entities/academy.entity";
import { PublicLinkAccess } from "src/entities/publicLinkAccess.entity";

@Injectable()
export class LinksService {
    constructor(
        @InjectRepository(PublicLink)
        private readonly publicLinkRepository: Repository<PublicLink>,
        private readonly i18nService: I18nService,
        @InjectRepository(Academy)
        private readonly academyRepository: Repository<Academy>
    ) {}

    async getPublicLinks(): Promise<CustomResponseType<PublicLink[]>> {
        try {
            const links = await this.publicLinkRepository.find({
                relations: ["academy", "createdBy", "accesses"],
            });

            return foundRes(
                this.i18nService.translate("links.fetched_successfully"),
                links
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async createPublicAthleteLink(
        user: User,
        createPublicAthleteLinkDto: CreatePublicAthleteLinkDto
    ): Promise<CustomResponseType<PublicLink>> {
        try {
            const academy = await this.academyRepository.findOne({
                where: { id: createPublicAthleteLinkDto.academyId },
            });

            if (!academy) {
                return errorRes(
                    this.i18nService.translate("error.academy_not_exist")
                );
            }

            const res = await this.publicLinkRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    const newLink = transactionalEntityManager.create(
                        PublicLink,
                        {
                            ...createPublicAthleteLinkDto,
                            academy,
                            createdBy: user,
                            isActive: true,
                        }
                    );

                    const savedLink = await transactionalEntityManager.save(
                        PublicLink,
                        newLink
                    );

                    return foundRes(
                        this.i18nService.translate(
                            "auth.pending_approval_users_fetched"
                        ),
                        savedLink
                    );
                }
            );

            return res;
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async checkPublicAthleteLinkExists(
        academyId: string,
        deviceIdentifier: string
    ): Promise<CustomResponseType<boolean>> {
        try {
            const existingLink = await this.publicLinkRepository.findOne({
                where: {
                    academy: {
                        id: academyId,
                    },
                },
                relations: ["accesses"],
            });

            if (!existingLink) {
                return forbiddenRes(
                    this.i18nService.translate("auth.unauthorized")
                );
            }

            const deviceExists = existingLink.accesses.some(
                (access) => access.deviceIdentifier === deviceIdentifier
            );

            if (deviceExists) {
                return forbiddenRes(
                    this.i18nService.translate("auth.unauthorized")
                );
            }

            return foundRes(
                this.i18nService.translate("links.fetched_successfully"),
                false
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

        if (error instanceof UnauthorizedException) {
            return errorRes(this.i18nService.translate("auth.unauthorized"));
        } else if (error instanceof InternalServerErrorException) {
            return errorRes(
                this.i18nService.translate("auth.internal_server_error")
            );
        } else {
            return errorRes(this.i18nService.translate("auth.unknown_error"));
        }
    }
}
