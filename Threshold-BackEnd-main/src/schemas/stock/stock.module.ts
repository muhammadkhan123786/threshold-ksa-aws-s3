import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { SportCategory } from "src/entities/stocksCategory.entity";
import { Stock } from "src/entities/stock.entity";
import { AthleteStock } from "src/entities/athleteStock";
import { AthleteCategorySize } from "src/entities/athleteCategorySize.entity";
import { Athlete } from "src/entities/athlete.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Stock,
            SportCategory,
            AthleteStock,
            AthleteCategorySize,
            Athlete,
        ]),
    ],
    controllers: [StockController],
    providers: [StockService],
    exports: [StockService],
})
export class StockModule {}
