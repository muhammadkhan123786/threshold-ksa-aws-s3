import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeeklySessionService } from "./weeklySession.service";
import { WeeklySessionController } from "./weeklySession.controller";
import { WeeklySession } from "../../entities/weeklySession.entity";
import { SessionsModule } from "../sessions/sessions.module";
import { Session } from "../../entities/session.entity";
import { AcademiesModule } from "../academies/academies.module";
import { TeamsModule } from "../teams/teams.module";

@Module({
    imports: [
        AcademiesModule,
        TeamsModule,
        SessionsModule,
        TypeOrmModule.forFeature([WeeklySession, Session]),
    ],
    controllers: [WeeklySessionController],
    providers: [WeeklySessionService],
    exports: [WeeklySessionService],
})
export class WeeklySessionModule {}
