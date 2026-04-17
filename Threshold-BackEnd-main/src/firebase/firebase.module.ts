import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FirebaseService } from "./firebase.service";
import { NotificationsController } from "./notifications.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Notification } from "src/entities/notification.entity";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Notification, User]),
    ],
    providers: [FirebaseService],
    controllers: [NotificationsController],
    exports: [FirebaseService],
})
export class FirebaseModule {
    static forRoot() {
        return {
            module: FirebaseModule,
        };
    }
}
