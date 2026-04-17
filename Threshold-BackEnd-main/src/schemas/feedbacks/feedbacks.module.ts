import { AcademiesModule } from "../academies/academies.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FeedbacksService } from "./feedbacks.service";
import { FeedbacksController } from "./feedbacks.controller";
import { Feedback } from "../../entities/feedback.entity";

@Module({
    imports: [AcademiesModule, TypeOrmModule.forFeature([Feedback])],
    controllers: [FeedbacksController],
    providers: [FeedbacksService],
    exports: [FeedbacksService],
})
export class FeedbacksModule {}
