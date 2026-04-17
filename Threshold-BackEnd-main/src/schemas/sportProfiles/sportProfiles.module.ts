import { AcademiesModule } from "../academies/academies.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SportProfilesService } from "./sportProfiles.service";
import { SportProfilesController } from "./sportProfiles.controller";
import { SportProfile } from "../../entities/sportProfile.entity";

@Module({
    imports: [AcademiesModule, TypeOrmModule.forFeature([SportProfile])],
    controllers: [SportProfilesController],
    providers: [SportProfilesService],
    exports: [SportProfilesService],
})
export class SportProfilesModule {}
