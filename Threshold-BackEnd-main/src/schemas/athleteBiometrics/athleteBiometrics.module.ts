import { AthletesModule } from "../athletes/athletes.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AthleteBiometricsService } from "./athleteBiometrics.service";
import { AthleteBiometricsController } from "./athleteBiometrics.controller";
import { AthleteBiometric } from "../../entities/athleteBiometric.entity";

@Module({
    imports: [AthletesModule, TypeOrmModule.forFeature([AthleteBiometric])],
    controllers: [AthleteBiometricsController],
    providers: [AthleteBiometricsService],
    exports: [AthleteBiometricsService],
})
export class AthleteBiometricsModule {}
