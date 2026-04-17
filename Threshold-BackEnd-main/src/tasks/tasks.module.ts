import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AthleteSubscription } from "../entities/athleteSubscription.entity";
import { TasksService } from "./tasks.service";
import { AthleteSubscriptionService } from "src/schemas/AthleteSubscription/athleteSubscription.service";
import { User } from "src/entities/user.entity";
import { AthletesModule } from "src/schemas/athletes/athletes.module";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([AthleteSubscription, User]),
        AthletesModule,
    ],
    providers: [AthleteSubscriptionService, TasksService],
})
export class TasksModule {}
