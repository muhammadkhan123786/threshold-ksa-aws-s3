import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkHistoryService } from "./workHistory.service";
import { WorkHistoryController } from "./workHistory.controller";
import { WorkHistory } from "src/entities/workHistory.entity";
import { Coach } from "src/entities/coach.entity";
import { ClubAdmin } from "src/entities/clubAdmin.entity";
import { Manager } from "src/entities/manager.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([WorkHistory, Coach, ClubAdmin, Manager]),
    ],
    controllers: [WorkHistoryController],
    providers: [WorkHistoryService],
    exports: [WorkHistoryService],
})
export class WorkHistoryModule {}
