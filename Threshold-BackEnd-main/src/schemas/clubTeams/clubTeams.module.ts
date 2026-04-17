import { AcademiesModule } from "../academies/academies.module";
import { CoachesModule } from "../coaches/coaches.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClubTeamsService } from "./clubTeams.service";
import { Team } from "../../entities/team.entity";
import { AthletesModule } from "../athletes/athletes.module";
import { Branch } from "../../entities/branch.entity";
import { Athlete } from "src/entities/athlete.entity";
import { ClubTeamsController } from "./clubTeams.controller";
import { Session } from "src/entities/session.entity";
import { TeamGoal } from "src/entities/teamGoal.entity";
import { SubGoal } from "src/entities/subGoal.entity";
import { Week } from "src/entities/week.entity";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { Contract } from "src/entities/contract.entity";
@Module({
    imports: [
        AcademiesModule,
        CoachesModule,
        AthletesModule,
        TypeOrmModule.forFeature([
            Team,
            Branch,
            Athlete,
            Session,
            TeamGoal,
            SubGoal,
            Week,
            sportClubProfiles,
            Contract
        ]),
    ],
    controllers: [ClubTeamsController],
    providers: [ClubTeamsService],
    exports: [ClubTeamsService],
})
export class ClubTeamsModule {}
