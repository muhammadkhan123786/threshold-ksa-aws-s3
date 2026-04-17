import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractAuditService } from "./contractAudit.service";
import { ContractAuditController } from "./contractAudit.controller";
import { ContractAudit } from "src/entities/contractAudit.entity";
import { Contract } from "src/entities/contract.entity";
import { User } from "src/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ContractAudit, Contract, User]),
    ],
    controllers: [ContractAuditController],
    providers: [ContractAuditService],
    exports: [ContractAuditService],
})
export class ContractAuditModule {} 