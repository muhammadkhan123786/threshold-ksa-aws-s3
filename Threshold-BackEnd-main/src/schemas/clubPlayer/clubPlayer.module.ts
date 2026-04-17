import { AcademiesModule } from "../academies/academies.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Athlete } from "../../entities/athlete.entity";
import { Contract } from "../../entities/contract.entity";
import { AthleteProfilesModule } from "../athleteProfiles/athleteProfiles.module";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { AthleteClothing } from "src/entities/athleteClothing.entity";
import { EmergencyContact } from "src/entities/emergencyContact.entity";
import { ClubPlayerController } from "./clubPlayer.controller";
import { ClubPlayerService } from "./clubPlayer.service";
import { S3Service } from "src/s3/s3.service";
import { CreatePlayerByTeamDto } from "src/dto/clubPlayer/create-player-by-team.dto";
import { ClubPlayerBiometric } from "src/entities/clubPlayerBiometric.entity";
import { ClubPlayerBiometricsController } from "./clubPlayerBiometrics.controller";
import { ClubPlayerBiometricsService } from "./clubPlayerBiometrics.service";

@Module({
    imports: [
        forwardRef(() => AcademiesModule),
        TypeOrmModule.forFeature([
            Athlete,
            Contract,
            AthleteBankDetails,
            AthleteClothing,
            EmergencyContact,
            ClubPlayerBiometric,
        ]),
        forwardRef(() => AthleteProfilesModule),
    ],
    controllers: [ClubPlayerController, ClubPlayerBiometricsController],
    providers: [ClubPlayerService, S3Service, ClubPlayerBiometricsService],
    exports: [ClubPlayerService, TypeOrmModule, ClubPlayerBiometricsService],
})
export class ClubPlayerModule {}
