import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AthleteHealthController } from "./athleteHealth.controller";
import { AthleteHealthService } from "./athleteHealth.service";
import { Athlete } from "src/entities/athlete.entity";
import { AthleteHealthRecords } from "src/entities/athleteHealthRecords.entity";
import { S3Service } from "../s3/s3.service";

@Module({
    imports: [TypeOrmModule.forFeature([Athlete, AthleteHealthRecords])],
    controllers: [AthleteHealthController],
    providers: [AthleteHealthService, S3Service],
    exports: [AthleteHealthService],
})
export class AthleteHealthModule {}
