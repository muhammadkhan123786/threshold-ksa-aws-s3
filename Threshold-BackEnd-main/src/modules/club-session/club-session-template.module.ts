import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClubSessionTemplate } from "../../entities/clubSessionTemplate.entity";
import { ClubSessionTemplateService } from "./club-session-template.service";
import { ClubSessionTemplateController } from "./club-session-template.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([ClubSessionTemplate]),
    ],
    providers: [ClubSessionTemplateService],
    controllers: [ClubSessionTemplateController],
    exports: [ClubSessionTemplateService],
})
export class ClubSessionTemplateModule {} 