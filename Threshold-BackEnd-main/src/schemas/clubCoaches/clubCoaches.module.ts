import { Branch } from "src/entities/branch.entity";
import { Academy } from "src/entities/academy.entity";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coach } from "src/entities/coach.entity";
import { UsersModule } from "../users/users.module";
import { AcademiesModule } from "../academies/academies.module";
import { ClubCoachesService } from "./clubCoaches.service";
import { ClubCoachesController } from "./clubCoaches.controller";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { User } from "src/entities/user.entity";
import { Contract } from "src/entities/contract.entity";
import { S3Service } from "src/s3/s3.service";
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coach,
            User,
            Academy,
            Branch,
            sportClubProfiles,
            Contract,
        ]),
        forwardRef(() => UsersModule),
        forwardRef(() => AcademiesModule),
    ],
    controllers: [ClubCoachesController],
    providers: [ClubCoachesService, S3Service],
    exports: [ClubCoachesService, TypeOrmModule],
})
export class ClubCoachesModule {}
