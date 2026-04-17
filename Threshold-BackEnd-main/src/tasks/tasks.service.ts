import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FirebaseService } from "src/firebase/firebase.service";
import { MailerService } from "src/mailer/mailer.service";
import { AthletesService } from "src/schemas/athletes/athletes.service";
import { AthleteSubscriptionService } from "src/schemas/AthleteSubscription/athleteSubscription.service";

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly subscriptionService: AthleteSubscriptionService,
        private readonly notificationService: FirebaseService,
        private readonly athleteService: AthletesService,
        private readonly emailService: MailerService
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleNinExprationDatesCron() {
        this.logger.log("Running scheduled task at midnight for athletes");
        await this.athleteService.handleNinExpirationNotifications();
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleSubscriptionCron() {
        this.logger.log("Running scheduled task at midnight");
        await this.subscriptionService.handleSubscriptionCases();
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleUnseenNotificationsCron() {
        this.logger.log("Running scheduled task to check unseen notifications");

        try {
            const topics = await this.notificationService.getTopics();

            for (const topic of topics) {
                const users =
                    await this.notificationService.getUsersByTopic(topic);

                for (const user of users) {
                    const unseenNotifications =
                        await this.notificationService.getUnseenNotificationsByUserAndTopic(
                            user.id,
                            topic
                        );

                    if (unseenNotifications.length > 0) {
                        await this.emailService.sendNotificationEmail(
                            user.email,
                            user.username,
                            user.academy?.name || "Academy",
                            unseenNotifications
                        );
                    }
                }
            }
        } catch (error) {
            this.logger.error("Error running scheduled task", error.stack);
        }
    }
}
