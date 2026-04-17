import { UsersModule } from "../users/users.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AcademiesService } from "./academies.service";
import { AcademiesController } from "./academies.controller";
import { Academy } from "../../entities/academy.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Academy]),
        forwardRef(() => UsersModule),
    ],
    controllers: [AcademiesController],
    providers: [AcademiesService],
    exports: [AcademiesService],
})
export class AcademiesModule {}
