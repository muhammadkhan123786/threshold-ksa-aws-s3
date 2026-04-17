import { AthletesModule } from "../athletes/athletes.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AthleteBatteriesService } from "./athleteBatteries.service";
import { AthleteBatteriesController } from "./athleteBatteries.controller";
import { AthleteBattery } from "../../entities/athleteBattery.entity";
import { Team } from "src/entities/team.entity";

@Module({
    imports: [AthletesModule, TypeOrmModule.forFeature([AthleteBattery, Team])],
    controllers: [AthleteBatteriesController],
    providers: [AthleteBatteriesService],
    exports: [AthleteBatteriesService],
})
export class AthleteBatteriesModule {}
