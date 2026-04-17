import { AcademiesModule } from "../academies/academies.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Manager } from "src/entities/manager.entity";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { SportClubProfilesController } from "./SportClubProfiles.controller";
import { SportClubProfilesService } from "./SportClubProfiles.service";

@Module({
    imports: [
        AcademiesModule,
        TypeOrmModule.forFeature([sportClubProfiles, Manager]),
    ],
    controllers: [SportClubProfilesController],
    providers: [SportClubProfilesService],
    exports: [SportClubProfilesService],
})
export class SportClubProfilesModule {}
