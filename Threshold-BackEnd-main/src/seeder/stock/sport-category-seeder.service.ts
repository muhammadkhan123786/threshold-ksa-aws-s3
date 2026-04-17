import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SportCategory } from "src/entities/stocksCategory.entity";
import { sportClubProfiles } from "src/entities/sportClubProfiles.entity";
import { Athlete } from "src/entities/athlete.entity";
import { AthleteCategorySize } from "src/entities/athleteCategorySize.entity";
import {
    CategoryType,
    MeasurementUnit,
    ClothingSize,
    ShoeSizeUS,
    ShoeSizeEU,
} from "src/enums/stock.enum";

@Injectable()
export class SportCategorySeederService {
    private readonly logger = new Logger(SportCategorySeederService.name);

    constructor(
        @InjectRepository(SportCategory)
        private readonly categoryRepository: Repository<SportCategory>,
        @InjectRepository(sportClubProfiles)
        private readonly sportClubProfileRepository: Repository<sportClubProfiles>,
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        @InjectRepository(AthleteCategorySize)
        private readonly athleteCategorySizeRepository: Repository<AthleteCategorySize>
    ) {}

    async seedCategoriesForProfiles(): Promise<void> {
        try {
            const profiles = await this.sportClubProfileRepository.find();

            if (!profiles.length) {
                this.logger.error("No profiles found. Seeder skipped.");
                return;
            }

            for (const profile of profiles) {
                const existingCategoriesCount =
                    await this.categoryRepository.count({
                        where: { sportClubProfile: { id: profile.id } },
                    });

                if (existingCategoriesCount > 0) {
                    this.logger.log(
                        `Categories already exist for profile: ${profile.id}`
                    );
                } else {
                    const categories = this.getDefaultCategories(profile);
                    const savedCategories =
                        await this.categoryRepository.save(categories);
                    this.logger.log(
                        `Categories added for profile: ${profile.id}`
                    );

                    await this.seedAthleteCategorySizes();
                }
            }
        } catch (error) {
            this.logger.error(
                "Error while seeding categories for profiles",
                error.stack
            );
        }
    }

    private async seedAthleteCategorySizes() {
        try {
            const sportClubProfiles =
                await this.sportClubProfileRepository.find({
                    relations: ["categories"],
                });

            if (!sportClubProfiles.length) {
                this.logger.error(
                    "No sport club profiles found. Seeding skipped."
                );
                return;
            }

            for (const profile of sportClubProfiles) {
                const categories = profile.categories;

                if (!categories.length) {
                    this.logger.warn(
                        `No categories found for profile: ${profile.id}. Skipping.`
                    );
                    continue;
                }

                const athletes = await this.athleteRepository.find({
                    where: { sportProfile: { id: profile.id } },
                });

                if (!athletes.length) {
                    this.logger.warn(
                        `No athletes found for profile: ${profile.id}. Skipping.`
                    );
                    continue;
                }

                this.logger.log(
                    `Seeding AthleteCategorySizes for profile: ${profile.id} with ${categories.length} categories and ${athletes.length} athletes.`
                );

                for (const category of categories) {
                    for (const athlete of athletes) {
                        const existingSize =
                            await this.athleteCategorySizeRepository.count({
                                where: {
                                    athlete: { id: athlete.id },
                                    category: { id: category.id },
                                },
                            });

                        if (existingSize === 0) {
                            await this.athleteCategorySizeRepository.save({
                                athlete,
                                category,
                                sizeOptions: [category.sizeOptions[0]],
                            });

                            this.logger.log(
                                `AthleteCategorySize added for athlete: ${athlete.id}, category: ${category.categoryName}, profile: ${profile.id}`
                            );
                        } else {
                            this.logger.log(
                                `AthleteCategorySize already exists for athlete: ${athlete.id}, category: ${category.categoryName}, profile: ${profile.id}`
                            );
                        }
                    }
                }
            }
        } catch (error) {
            this.logger.error(
                "Error while seeding AthleteCategorySizes",
                error.stack
            );
        }
    }

    private getDefaultCategories(
        profile: sportClubProfiles
    ): Partial<SportCategory>[] {
        return [
            {
                categoryName: CategoryType.SHOES,
                measurementUnits: [MeasurementUnit.US, MeasurementUnit.EU],
                sizeOptions: this.getSizeOptions([
                    ...Object.values(ShoeSizeUS),
                    ...Object.values(ShoeSizeEU),
                ]),
                sportClubProfile: profile,
            },
            {
                categoryName: CategoryType.TSHIRT,
                measurementUnits: [MeasurementUnit.EU],
                sizeOptions: this.getSizeOptions(Object.values(ClothingSize)),
                sportClubProfile: profile,
            },
            {
                categoryName: CategoryType.PANTS,
                measurementUnits: [MeasurementUnit.EU],
                sizeOptions: this.getSizeOptions(Object.values(ClothingSize)),
                sportClubProfile: profile,
            },
        ];
    }

    private getSizeOptions(
        sizes: string[]
    ): { size: string; requiredQuantity: number }[] {
        return sizes.map((size) => ({
            size,
            requiredQuantity: 1,
        }));
    }
}
