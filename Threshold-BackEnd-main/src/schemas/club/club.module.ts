import { UsersModule } from "../users/users.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Academy } from "../../entities/academy.entity";
import { ClubController } from "./club.controller";
import { ClubService } from "./club.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Academy]),
        forwardRef(() => UsersModule),
    ],
    controllers: [ClubController],
    providers: [ClubService],
    exports: [ClubService],
})
export class ClubModule {}
