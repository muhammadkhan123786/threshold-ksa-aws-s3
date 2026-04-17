import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { AcademiesModule } from "../academies/academies.module";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { ClubAdminService } from "./clubAdmin.service";
import { ClubAdminController } from "./clubAdmin.controller";
import { ClubAdmin } from "src/entities/clubAdmin.entity";
import { Contract } from 'src/entities/contract.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClubAdmin, sportClubProfiles, Contract]),
        forwardRef(() => UsersModule),
        forwardRef(() => AcademiesModule),
    ],
    controllers: [ClubAdminController],
    providers: [ClubAdminService, S3Service],
    exports: [ClubAdminService, TypeOrmModule],
})
export class ClubAdminModule {}
