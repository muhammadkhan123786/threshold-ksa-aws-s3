import { AcademiesModule } from "../academies/academies.module";
import { AthletesModule } from "../athletes/athletes.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AthleteSubscription } from "src/entities/athleteSubscription.entity";
import { AthleteSubscriptionController } from "./athleteSubscription.controller";
import { AthleteSubscriptionService } from "./athleteSubscription.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([AthleteSubscription]),
        AcademiesModule,
        forwardRef(() => AthletesModule),
    ],
    controllers: [AthleteSubscriptionController],
    providers: [AthleteSubscriptionService],
    exports: [AthleteSubscriptionService],
})
export class AthleteSubscriptionModule {}
