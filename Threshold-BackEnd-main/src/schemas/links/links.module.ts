import { AcademiesModule } from "../academies/academies.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";
import { PublicLink } from "src/entities/publicLink.entity";
import { Academy } from "src/entities/academy.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PublicLink, Academy]),
        forwardRef(() => AcademiesModule),
    ],
    controllers: [LinksController],
    providers: [LinksService],
    exports: [LinksService],
})
export class LinksModule {}
