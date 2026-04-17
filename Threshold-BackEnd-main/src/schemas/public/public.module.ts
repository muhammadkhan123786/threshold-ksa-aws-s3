import { AcademiesModule } from "../academies/academies.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";
import { Athlete } from "../../entities/athlete.entity";
import { AthleteProfilesModule } from "../athleteProfiles/athleteProfiles.module";

@Module({
    imports: [
        AcademiesModule,
        TypeOrmModule.forFeature([Athlete]),
        forwardRef(() => AthleteProfilesModule),
    ],
    controllers: [PublicController],
    providers: [PublicService],
    exports: [PublicService],
})
export class PublicModule {}
