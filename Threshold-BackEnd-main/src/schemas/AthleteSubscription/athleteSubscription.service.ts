import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AthleteSubscription } from "../../entities/athleteSubscription.entity";
import {
    foundRes,
    notFoundRes,
    newInstanceRes,
    errorRes,
} from "src/lib/responses/restResponse";
import CustomResponseType from "src/types/customResponseType";
import { UpdateAthleteSubscriptionDto } from "src/dto/athleteSubscription/update-athleteSubscription.dto";
import { Athlete } from "src/entities/athlete.entity";
import { SubscriptionStatus } from "src/enums/subscription-status.enum";
import { FirebaseService } from "src/firebase/firebase.service";
import moment from "moment";

@Injectable()
export class AthleteSubscriptionService {
    constructor(
        @InjectRepository(AthleteSubscription)
        private readonly athleteSubscriptionRepository: Repository<AthleteSubscription>,
        private readonly firebaseService: FirebaseService
    ) {}
    async handleSubscriptionCases(): Promise<void> {
        const subscriptions = await this.athleteSubscriptionRepository.find({
            relations: ["athlete", "athlete.academy"],
        });

        for (const subscription of subscriptions) {
            const calculatedExpiryDate = subscription.calculateExpiryDate();
            subscription.expiryDate = calculatedExpiryDate;

            const remainingDays = subscription.calculateRemainingDays();

            if (remainingDays <= 5 && remainingDays > 0) {
                await this.createPreExpiryNotification(
                    subscription,
                    remainingDays
                );
            }

            switch (subscription.status) {
                case SubscriptionStatus.ACTIVE:
                    if (subscription.isExpired()) {
                        subscription.status = SubscriptionStatus.EXPIRED;

                        await this.createExpiryNotification(subscription);
                    }
                    break;

                case SubscriptionStatus.INACTIVE:
                    if (subscription.isExpired()) {
                        subscription.status = SubscriptionStatus.EXPIRED;

                        await this.createExpiryNotification(subscription);
                    } else {
                        subscription.remainingDays =
                            subscription.calculateRemainingDays();
                    }
                    break;

                case SubscriptionStatus.PENDING:
                    subscription.preserveRemainingDays();
                    break;

                case SubscriptionStatus.EXPIRED:
                    if (!subscription.isExpired()) {
                        subscription.status = SubscriptionStatus.ACTIVE;
                    }
                    break;

                default:
                    break;
            }

            subscription.lastChecked = new Date();

            try {
                await this.athleteSubscriptionRepository.save(subscription);
            } catch (error) {
                console.error(
                    `Error saving subscription ${subscription.id}:`,
                    error.message
                );
            }
        }
    }

    private async createPreExpiryNotification(
        subscription: AthleteSubscription,
        remainingDays: number
    ) {
        const notificationTitle = "إشعار بقرب انتهاء الاشتراك";

        const formattedExpiryDate = moment(subscription.expiryDate)
            .locale("ar")
            .format("D MMMM YYYY");

        const notificationMessage = `نود إعلامكم بأن اشتراك اللاعب ${subscription.athlete.firstName} ${subscription.athlete.lastName} سينتهي في غضون ${remainingDays} أيام (بتاريخ ${formattedExpiryDate}).`;

        const academyId = subscription.athlete.academy.id;

        await this.firebaseService.createNotification(
            academyId,
            notificationMessage,
            notificationTitle,
            "RENEWAL_REMINDER"
        );
    }

    private async createExpiryNotification(subscription: AthleteSubscription) {
        const notificationTitle = "إشعار بانتهاء اشتراك لاعب";

        const formattedExpiryDate = moment(subscription.expiryDate)
            .locale("ar")
            .format("D MMMM YYYY");

        const notificationMessage = `نود إعلامكم بأن اشتراك اللاعب ${subscription.athlete.firstName} ${subscription.athlete.lastName} قد انتهى بتاريخ ${formattedExpiryDate}.`;

        const academyId = subscription.athlete.academy.id;

        await this.firebaseService.createNotification(
            academyId,
            notificationMessage,
            notificationTitle
        );
    }

    async getAthleteSubscription(
        id: string
    ): Promise<CustomResponseType<AthleteSubscription>> {
        try {
            const subscription =
                await this.athleteSubscriptionRepository.findOne({
                    where: { athlete: { id } },
                });

            if (!subscription) {
                return notFoundRes("Athlete subscription does not exist");
            }

            return foundRes("Athlete subscription found", subscription);
        } catch (error) {
            return errorRes(error.message);
        }
    }
    async updateAthleteSubscription(
        id: string,
        updateAthleteSubscriptionDto: UpdateAthleteSubscriptionDto
    ): Promise<CustomResponseType<AthleteSubscription>> {
        try {
            let subscription = await this.athleteSubscriptionRepository.findOne(
                {
                    where: { athlete: { id } },
                }
            );

            if (!subscription) {
                subscription = this.athleteSubscriptionRepository.create({
                    ...updateAthleteSubscriptionDto,
                    athlete: { id } as Athlete,
                });

                const newSubscription =
                    await this.athleteSubscriptionRepository.save(subscription);
                return newInstanceRes(
                    "Athlete subscription created successfully",
                    newSubscription
                );
            }
            Object.assign(subscription, updateAthleteSubscriptionDto);
            const updatedSubscription =
                await this.athleteSubscriptionRepository.save(subscription);

            return newInstanceRes(
                "Athlete subscription updated successfully",
                updatedSubscription
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }
}
