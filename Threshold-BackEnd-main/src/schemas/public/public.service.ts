import { AcademiesService } from "../academies/academies.service";
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
import { Athlete } from "../../entities/athlete.entity";
import { CreateAthleteDto } from "../../dto/athletes/create-athlete.dto";
import { AthleteSubscription } from "src/entities/athleteSubscription.entity";
import { SubscriptionStatus } from "src/enums/subscription-status.enum";
import { AthleteUtil } from "src/lib/helpers/athlete.util";
import { PublicLink } from "src/entities/publicLink.entity";
import { I18nService } from "src/i18n/i18n.service";
import { PublicLinkAccess } from "src/entities/publicLinkAccess.entity";
import { FirebaseService } from "src/firebase/firebase.service";

@Injectable()
export class PublicService {
    constructor(
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        private readonly academiesService: AcademiesService,
        private readonly i18nService: I18nService,
        private readonly firebaseService: FirebaseService
    ) {}

    async createAthlete(
        academyId: string,
        createAthleteDto: CreateAthleteDto,
        deviceIdentifier: string
    ): Promise<CustomResponseType<Athlete>> {
        try {
            return await this.athleteRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    await AthleteUtil.checkAthleteNIN(
                        createAthleteDto,
                        transactionalEntityManager
                    );

                    const { periodOfSubscription, ...rest } = createAthleteDto;
                    const athleteObj = { ...rest } as any;

                    const academy =
                        await this.academiesService.getAcademyById(academyId);
                    if (academy.status !== 200) {
                        return errorRes(
                            this.i18nService.translate(
                                "error.academy_not_exist"
                            )
                        );
                    }

                    const existingLink =
                        await transactionalEntityManager.findOne(PublicLink, {
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

                    athleteObj["academy"] = academy.payload;

                    const newAthlete = transactionalEntityManager.create(
                        Athlete,
                        athleteObj
                    );
                    const savedAthlete = await transactionalEntityManager.save(
                        Athlete,
                        newAthlete
                    );

                    const newAccess = transactionalEntityManager.create(
                        PublicLinkAccess,
                        {
                            publicLink: existingLink,
                            deviceIdentifier,
                        }
                    );

                    await transactionalEntityManager.save(
                        PublicLinkAccess,
                        newAccess
                    );

                    const subscription = transactionalEntityManager.create(
                        AthleteSubscription,
                        {
                            status: SubscriptionStatus.ACTIVE,
                            period: periodOfSubscription,
                            athlete: savedAthlete,
                        }
                    );
                    await transactionalEntityManager.save(
                        AthleteSubscription,
                        subscription
                    );

                    const notificationTitle = this.i18nService.translate(
                        "notification.new_athlete_added_title"
                    );
                    const notificationBodyTemplate = this.i18nService.translate(
                        "notification.new_athlete_added_body"
                    );
                    const notificationBody = notificationBodyTemplate
                        .replace("{firstName}", savedAthlete.firstName)
                        .replace("{lastName}", savedAthlete.lastName)
                        .replace("{contactNumber}", savedAthlete.contactNumber);

                    await this.firebaseService.createNotification(
                        savedAthlete.academy.id,
                        notificationBody,
                        notificationTitle
                    );

                    return foundRes(
                        this.i18nService.translate(
                            "auth.pending_approval_users_fetched"
                        ),
                        savedAthlete
                    );
                }
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
