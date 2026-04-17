import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoachesService } from "./coaches.service";
import { CoachesController } from "./coaches.controller";
import { Coach } from "src/entities/coach.entity";
import { UsersModule } from "../users/users.module";
import { AcademiesModule } from "../academies/academies.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Coach]),
        forwardRef(() => UsersModule),
        forwardRef(() => AcademiesModule),
    ],
    controllers: [CoachesController],
    providers: [CoachesService],
    exports: [CoachesService, TypeOrmModule],
})
export class CoachesModule {}
