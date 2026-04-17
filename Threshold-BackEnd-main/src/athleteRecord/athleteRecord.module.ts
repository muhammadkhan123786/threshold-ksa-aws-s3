import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AthleteRecordController } from "./athleteRecord.controller";
import { AthleteRecordService } from "./athleteRecord.service";
import { AthleteRecord } from "src/entities/athleteRecord.entity";
import { Athlete } from "src/entities/athlete.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AthleteRecord, Athlete])],
    controllers: [AthleteRecordController],
    providers: [AthleteRecordService],
    exports: [AthleteRecordService],
})
export class AthleteRecordModule {}
