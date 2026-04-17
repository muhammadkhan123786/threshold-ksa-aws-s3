import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BranchController } from "./branch.controller";
import { BranchService } from "./branch.service";
import { Branch } from "src/entities/branch.entity";
import { AcademiesModule } from "src/schemas/academies/academies.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Branch]),
        forwardRef(() => AcademiesModule),
    ],
    controllers: [BranchController],
    providers: [BranchService],
    exports: [BranchService],
})
export class BranchModule {}
