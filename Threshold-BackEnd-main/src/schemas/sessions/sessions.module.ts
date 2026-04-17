import { AcademiesModule } from "../academies/academies.module";
import { TeamsModule } from "../teams/teams.module";
import { CoachesModule } from "../coaches/coaches.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { Session } from "../../entities/session.entity";
import { AthletesModule } from "../athletes/athletes.module";
import { SessionRecordsModule } from "../sessionRecords/sessionRecords.module";
import { PlanningSession } from "src/entities/planningSession.entity";
import { SessionRecord } from "src/entities/sessionRecord.entity";

@Module({
    imports: [
        AcademiesModule,
        AthletesModule,
        TeamsModule,
        CoachesModule,
        CoachesModule,
        forwardRef(() => SessionRecordsModule),
        TypeOrmModule.forFeature([Session, PlanningSession, SessionRecord]),
    ],
    controllers: [SessionsController],
    providers: [SessionsService],
    exports: [SessionsService],
})
export class SessionsModule {}
