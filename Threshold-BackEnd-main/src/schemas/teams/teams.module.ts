import { AcademiesModule } from "../academies/academies.module";
import { CoachesModule } from "../coaches/coaches.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TeamsService } from "./teams.service";
import { TeamsController } from "./teams.controller";
import { Team } from "../../entities/team.entity";
import { AthletesModule } from "../athletes/athletes.module";
import { Branch } from "../../entities/branch.entity";
import { Athlete } from "src/entities/athlete.entity";

@Module({
    imports: [
        AcademiesModule,
        CoachesModule,
        AthletesModule,
        TypeOrmModule.forFeature([Team, Branch, Athlete]),
    ],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule {}
