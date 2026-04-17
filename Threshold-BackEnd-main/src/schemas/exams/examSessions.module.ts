import { AcademiesModule } from "../academies/academies.module";
import { TeamsModule } from "../teams/teams.module";
import { CoachesModule } from "../coaches/coaches.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Session } from "../../entities/session.entity";
import { AthletesModule } from "../athletes/athletes.module";
import { SessionRecordsModule } from "../sessionRecords/sessionRecords.module";
import { PlanningSession } from "src/entities/planningSession.entity";
import { SessionRecord } from "src/entities/sessionRecord.entity";
import { ExamSessionsController } from "./examSessions.controller";
import { ExamSessionsService } from "./examSessions.service";
import { Academy } from "src/entities/academy.entity";
import { Team } from "src/entities/team.entity";

@Module({
    imports: [
        AcademiesModule,
        AthletesModule,
        TeamsModule,
        CoachesModule,
        CoachesModule,
        forwardRef(() => SessionRecordsModule),
        TypeOrmModule.forFeature([
            Session,
            PlanningSession,
            SessionRecord,
            Academy,
            Team,
        ]),
    ],
    controllers: [ExamSessionsController],
    providers: [ExamSessionsService],
    exports: [ExamSessionsService],
})
export class examSessionsModule {}
