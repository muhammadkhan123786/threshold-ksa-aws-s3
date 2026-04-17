import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClubManagerService } from "./clubManager.service";
import { Manager } from "src/entities/manager.entity";
import { Branch } from "src/entities/branch.entity";
import { User } from "src/entities/user.entity";
import { S3Service } from "src/s3/s3.service";
import { Contract } from "src/entities/contract.entity";
import { ClubManagerController } from "./clubManager.controller";
import { Academy } from "src/entities/academy.entity";
import { MedicalFiles } from "src/entities/medical-files.entity";
import { MedicalHistory } from "src/entities/medical-history.entity";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { Documents } from "src/entities/documents.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Manager,
            Branch,
            User,
            Contract,
            Academy,
            MedicalFiles,
            MedicalHistory,
            AthleteBankDetails,
            Documents,
        ]),
    ],
    controllers: [ClubManagerController],
    providers: [ClubManagerService, S3Service],
    exports: [ClubManagerService],
})
export class ClubManagerModule {}
