import { AcademiesModule } from "../academies/academies.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AthletesService } from "./athletes.service";
import { AthletesController } from "./athletes.controller";
import { Athlete } from "../../entities/athlete.entity";
import { AthleteProfilesModule } from "../athleteProfiles/athleteProfiles.module";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { AthleteClothing } from "src/entities/athleteClothing.entity";
import { EmergencyContact } from "src/entities/emergencyContact.entity";

@Module({
    imports: [
        AcademiesModule,
        TypeOrmModule.forFeature([
            Athlete,
            AthleteBankDetails,
            AthleteClothing,
            EmergencyContact,
        ]),
        forwardRef(() => AthleteProfilesModule),
    ],
    controllers: [AthletesController],
    providers: [AthletesService],
    exports: [AthletesService],
})
export class AthletesModule {}
