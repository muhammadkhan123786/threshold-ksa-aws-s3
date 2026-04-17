import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClubSessionService } from "./club-session.service";
import { ClubSessionController } from "./club-session.controller";
import { ClubSession } from "../../entities/clubSession.entity";
import { ClubSessionTemplate } from "../../entities/clubSessionTemplate.entity";
import { Team } from "../../entities/team.entity";
import { Athlete } from "../../entities/athlete.entity";
import { S3Service } from "src/s3/s3.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ClubSession, ClubSessionTemplate, Team, Athlete]),
    ],
    providers: [ClubSessionService, S3Service],
    controllers: [ClubSessionController],
    exports: [ClubSessionService],
})
export class ClubSessionModule {}
