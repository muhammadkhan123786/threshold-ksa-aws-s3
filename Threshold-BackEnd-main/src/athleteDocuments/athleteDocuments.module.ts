import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { S3Module } from "../s3/s3.module";
import { Athlete } from "src/entities/athlete.entity";
import { AthleteDocument } from "src/entities/athleteDocument.entity";
import { AthleteDocumentsService } from "./athleteDocuments.service";
import { AthleteDocumentsController } from "./athleteDocuments.controller";

@Module({
    imports: [TypeOrmModule.forFeature([AthleteDocument, Athlete]), S3Module],
    controllers: [AthleteDocumentsController],
    providers: [AthleteDocumentsService],
})
export class AthleteDocumentsModule {}
