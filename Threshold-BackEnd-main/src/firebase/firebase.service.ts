import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as admin from "firebase-admin";
import { User } from "src/entities/user.entity";
import { Notification } from "src/entities/notification.entity";

import { Brackets, In, Repository } from "typeorm";

@Injectable()
export class FirebaseService {
    private defaultApp: admin.app.App;
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Notification)
        private readonly notificationsRepository: Repository<Notification>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {
        const key = this.configService.get<string>(
            "FIREBASE_SERVICE_ACCOUNT_KEY"
        );

        if (!key) {
            console.warn(
                "Firebase is not configured. Skipping Firebase initialization."
            );
            return;
        }

        try {
            const serviceAccount = JSON.parse(key);

            this.defaultApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: serviceAccount.project_id,
                    privateKey: serviceAccount.private_key.replace(
                        /\\n/g,
                        "\n"
                    ),
                    clientEmail: serviceAccount.client_email,
                }),
            });
        } catch (err) {
            console.warn(
                "Failed to initialize Firebase. Skipping. Error:",
                err.message
            );
            this.defaultApp = null;
        }
    }

    async subscribeToTopic(token: string, topic: string) {
        return await this.defaultApp.messaging().subscribeToTopic(token, topic);
    }

    async sendNotificationToTopic(
        topic: string,
        payload: admin.messaging.MessagingPayload
    ) {
        const message = {
            topic,
            ...payload,
        };
        return await this.defaultApp.messaging().send(message);
    }

    async createNotification(
        topic: string,
        message: string,
        title: string,
        category?: string
    ): Promise<Notification> {
        const notification = this.notificationsRepository.create({
            message,
            title,
            topic,
            category,
        });
        return this.notificationsRepository.save(notification);
    }

    async markAsSeen(notificationId: string, userId: string): Promise<void> {
        const notification = await this.notificationsRepository.findOne({
            where: { id: notificationId },
            relations: ["seenByUsers"],
        });
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });

        if (notification && user) {
            if (!notification.seenByUsers) {
                notification.seenByUsers = [];
            }
            notification.seenByUsers.push(user);
            await this.notificationsRepository.save(notification);
        }
    }

    async markAllAsSeen(topic: string, userId: string): Promise<void> {
        try {
            const notifications = await this.notificationsRepository.find({
                where: { topic },
                relations: ["seenByUsers"],
            });

            for (const notification of notifications) {
                if (!notification.seenByUsers.some((u) => u.id === userId)) {
                    if (!notification.seenByUsers) {
                        notification.seenByUsers = [];
                    }

                    const user = await this.usersRepository.findOne({
                        where: { id: userId },
                    });

                    if (user) {
                        notification.seenByUsers.push(user);
                        await this.notificationsRepository.save(notification);
                    }
                }
            }
        } catch (error) {
            console.error("Error marking all notifications as seen:", error);
            throw new Error("Unable to mark all notifications as seen");
        }
    }

    async getAllNotifications(
        userId: string,
        topic: string
    ): Promise<Omit<Notification, "seenByUsers">[]> {
        {
            try {
                const notifications = await this.notificationsRepository.find({
                    where: { topic },
                    relations: ["seenByUsers"],
                });

                const notificationsWithSeenStatus = notifications.map(
                    (notification) => {
                        const seen = notification.seenByUsers.some(
                            (user) => user.id === userId
                        );

                        const { seenByUsers, ...rest } = notification;
                        return {
                            ...rest,
                            seen,
                        };
                    }
                );

                return notificationsWithSeenStatus;
            } catch (error) {
                console.error("Error retrieving notifications:", error);
                throw new Error("Unable to retrieve notifications");
            }
        }
    }

    async clearNotifications(): Promise<void> {
        await this.notificationsRepository.clear();
    }
    async getUsersByTopic(topic: string): Promise<User[]> {
        return this.usersRepository
            .createQueryBuilder("user")
            .where("user.academyId = :topic", { topic })
            .getMany();
    }
    async getUnseenNotificationsByUserAndTopic(
        userId: string,
        topic: string
    ): Promise<Notification[]> {
        try {
            const notifications = await this.notificationsRepository.find({
                where: { topic },
                relations: ["seenByUsers"],
            });

            const notificationsWithSeenStatus = notifications.filter(
                (notification) => {
                    const seen = notification.seenByUsers.some(
                        (user) => user.id === userId
                    );

                    const { seenByUsers, ...rest } = notification;

                    if (!seen)
                        return {
                            ...rest,
                            seen,
                        };
                }
            );

            return notificationsWithSeenStatus;
        } catch (error) {
            console.error("Error retrieving notifications:", error);
            throw new Error("Unable to retrieve notifications");
        }
    }

    async getTopics(): Promise<string[]> {
        const notifications = await this.notificationsRepository
            .createQueryBuilder("notification")
            .select("DISTINCT notification.topic")
            .getRawMany();

        return notifications.map((n) => n.topic);
    }
}
