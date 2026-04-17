import { SportCategorySeederService } from "./stock/sport-category-seeder.service";
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

export async function runSeeders(app: NestExpressApplication) {
    const logger = new Logger("StockSeederRunner");
    const seederService = app.get(SportCategorySeederService);

    try {
        logger.log("Running Sport Category Seeder...");
        await seederService.seedCategoriesForProfiles();
        logger.log("Seeding completed successfully.");
    } catch (error) {
        logger.error("Error during seeding process:", error.message);
    }
}
