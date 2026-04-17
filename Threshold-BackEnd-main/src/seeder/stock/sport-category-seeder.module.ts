import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SportCategory } from "src/entities/stocksCategory.entity";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { SportCategorySeederService } from "./sport-category-seeder.service";
import { Athlete } from "src/entities/athlete.entity";
import { AthleteCategorySize } from "src/entities/athleteCategorySize.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SportCategory,
            sportClubProfiles,
            Athlete,
            AthleteCategorySize,
        ]),
    ],
    providers: [SportCategorySeederService],
    exports: [SportCategorySeederService],
})
export class SportCategorySeederModule {}
