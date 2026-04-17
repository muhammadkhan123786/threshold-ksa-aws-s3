import { Controller, Post, Body, Get, UseGuards, Query } from "@nestjs/common";
import * as admin from "firebase-admin";
import { FirebaseService } from "./firebase.service";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { User } from "src/entities/user.entity";
import { GetUser } from "src/auth/decorators/get-user.decorator";

@Controller("notifications")
export class NotificationsController {
    constructor(private readonly firebaseService: FirebaseService) {}

    @Post("subscribe")
    async subscribeToTopic(
        @Body("token") token: string,
        @Body("topic") topic: string
    ) {
        return this.firebaseService.subscribeToTopic(token, topic);
    }

    @Post("send")
    async sendNotification(
        @Body("topic") topic: string,
        @Body("payload") payload: admin.messaging.MessagingPayload
    ) {
        return this.firebaseService.sendNotificationToTopic(topic, payload);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post("mark-all-as-seen")
    async markAllAsSeen(@Body("topic") topic: string, @GetUser() user: User) {
        const userId = (user as any).payload.id;

        console.log("userId", userId);
        await this.firebaseService.markAllAsSeen(topic, userId);
        return { message: "All notifications marked as seen" };
    }

    @Post("mark-as-seen")
    async markNotificationAsSeen(
        @Body("notificationId") notificationId: string,
        @Body("userId") userId: string
    ) {
        await this.firebaseService.markAsSeen(notificationId, userId);
        return { message: "Notification marked as seen" };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get("all")
    async getAllNotifications(
        @Query("topic") topic: string,
        @GetUser() user: User
    ) {
        const userId = (user as any).payload.id;
        const notifications = await this.firebaseService.getAllNotifications(
            userId,
            topic
        );
        return { notifications };
    }

    @Post("clear")
    async clearNotifications() {
        await this.firebaseService.clearNotifications();
        return { message: "All notifications cleared" };
    }
}
