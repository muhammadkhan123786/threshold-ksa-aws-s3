import { AcademiesModule } from "../academies/academies.module";
import { AthletesModule } from "../athletes/athletes.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AthleteProfilesService } from "./athleteProfiles.service";
import { AthleteProfilesController } from "./athleteProfiles.controller";
import { AthleteProfile } from "../../entities/athleteProfile.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([AthleteProfile]),
        AcademiesModule,
        forwardRef(() => AthletesModule),
    ],
    controllers: [AthleteProfilesController],
    providers: [AthleteProfilesService],
    exports: [AthleteProfilesService],
})
export class AthleteProfilesModule {}
