import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import {
    IPaginationOptions,
    paginate,
    Pagination,
    PaginationTypeEnum,
} from "nestjs-typeorm-paginate";
import { CreateStockDto } from "src/dto/stock/create-stock.dto";
import { UpdateStockDto } from "src/dto/stock/update-stock.dto";
import { Athlete } from "src/entities/athlete.entity";
import { AthleteCategorySize } from "src/entities/athleteCategorySize.entity";
import { AthleteStock } from "src/entities/athleteStock";
import { Stock } from "src/entities/stock.entity";
import { SportCategory } from "src/entities/stocksCategory.entity";
import { AthleteClothingStatus } from "src/enums/athletes.enum";
import { PaginationParams } from "src/types/paginationParams";
import { Repository } from "typeorm";

@Injectable()
export class StockService {
    private readonly logger = new Logger(StockService.name);

    constructor(
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        @InjectRepository(Stock)
        private readonly stockRepository: Repository<Stock>,
        @InjectRepository(AthleteCategorySize)
        private readonly athleteCategorySizeRepository: Repository<AthleteCategorySize>,
        @InjectRepository(AthleteStock)
        private readonly athleteStockRepository: Repository<AthleteStock>,
        @InjectRepository(SportCategory)
        private readonly categoryRepository: Repository<SportCategory>
    ) {}
    async updateOrCreateAthleteStock(
        athleteId: string,
        stockData: Array<{ categoryId: string; size: string; quantity: number }>
    ) {
        const updatedStocks = [];

        for (const stock of stockData) {
            const { categoryId, size, quantity } = stock;

            const categoryStock = await this.stockRepository.findOne({
                where: { category: { id: categoryId } },
            });

            if (!categoryStock) {
                throw new BadRequestException(
                    `No stock found for category: ${categoryId}`
                );
            }

            const sizeOption = categoryStock.sizeOptions.find(
                (option) => option.size === size
            );

            if (!sizeOption) {
                throw new BadRequestException(
                    `Size ${size} is not available in Stock`
                );
            }

            if (sizeOption.quantity < quantity) {
                throw new BadRequestException(
                    `Insufficient stock for size: ${size} in category: ${categoryId}. Available: ${sizeOption.quantity}, Required: ${quantity}`
                );
            }

            const existingStock = await this.athleteStockRepository.findOne({
                where: {
                    athlete: { id: athleteId },
                    category: { id: categoryId },
                    size,
                },
            });

            if (existingStock) {
                existingStock.quantity = quantity;
                await this.athleteStockRepository.save(existingStock);
                updatedStocks.push(existingStock);
            } else {
                const newStock = this.athleteStockRepository.create({
                    athlete: { id: athleteId },
                    category: { id: categoryId },
                    size,
                    quantity,
                });
                await this.athleteStockRepository.save(newStock);
                updatedStocks.push(newStock);
            }

            sizeOption.quantity -= quantity;

            categoryStock.sizeOptions = categoryStock.sizeOptions.map(
                (option) => (option.size === size ? sizeOption : option)
            );
            await this.stockRepository.save(categoryStock);
        }

        return {
            message: "Stock updated or created successfully",
            updatedStocks,
        };
    }

    async getAthleteStockFields(athleteId: string) {
        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
            relations: [
                "categorySizes.category",
                "assignedStock",
                "assignedStock.category",
            ],
        });

        if (!athlete) {
            throw new NotFoundException("Athlete not found");
        }

        const stockFields = athlete.categorySizes.map((categorySize) => {
            const categoryName =
                categorySize?.category?.categoryName || "Unknown";
            const categoryId = categorySize?.category?.id || "Unknown";

            const sizes = categorySize.sizeOptions.map((sizeOption) => {
                const assignedStock = athlete.assignedStock.find(
                    (stock) =>
                        stock?.category?.id === categorySize?.category?.id &&
                        stock?.size === sizeOption.size
                );

                return {
                    categoryId,
                    categoryName,
                    size: sizeOption.size,
                    quantity: assignedStock?.quantity || 0,
                };
            });

            return sizes;
        });

        return stockFields.flat();
    }
    async getAthleteClothingStatus(filter: {
        sportId: string;
        paginationParams?: IPaginationOptions;
    }): Promise<{ data: any[]; meta: any }> {
        const { sportId, paginationParams } = filter;

        const queryBuilder = this.athleteRepository
            .createQueryBuilder("athlete")
            .leftJoinAndSelect("athlete.categorySizes", "categorySizes")
            .leftJoinAndSelect("categorySizes.category", "category")
            .leftJoinAndSelect("athlete.assignedStock", "assignedStock")
            .leftJoinAndSelect(
                "assignedStock.category",
                "assignedStockCategory"
            )
            .where("athlete.sportProfileId = :sportId", { sportId });

        const totalItems = await queryBuilder.getCount();

        const paginationResult = await paginate<Athlete>(queryBuilder as any, {
            ...paginationParams,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
            metaTransformer: ({ currentPage, itemCount, itemsPerPage }) => {
                const totalPages = Math.round(totalItems / itemsPerPage);
                return {
                    currentPage,
                    itemCount,
                    itemsPerPage,
                    totalPages: totalPages === 0 ? 1 : totalPages,
                    totalItems,
                };
            },
        });

        const data = await Promise.all(
            paginationResult.items.map(async (athlete) => {
                const age = moment().diff(moment(athlete.dateOfBirth), "years");
                const genderAndAge = `${athlete.gender}, ${age}`;

                const requirements = (
                    await Promise.all(
                        athlete.categorySizes.flatMap(async (categorySize) => {
                            const categoryName =
                                categorySize?.category?.categoryName ||
                                "Unknown";

                            return Promise.all(
                                categorySize.sizeOptions.map(
                                    async (sizeOption) => {
                                        const assignedStock =
                                            athlete.assignedStock.find(
                                                (stock) =>
                                                    stock?.category?.id ===
                                                        categorySize?.category
                                                            ?.id &&
                                                    stock?.size ===
                                                        sizeOption.size
                                            );

                                        const stockForCategory =
                                            await this.stockRepository.findOne({
                                                where: {
                                                    category: {
                                                        id: categorySize
                                                            .category.id,
                                                    },
                                                },
                                            });

                                        const stockAvailable =
                                            stockForCategory?.sizeOptions.some(
                                                (stockOption) =>
                                                    stockOption.size ===
                                                    sizeOption.size
                                            );

                                        const shortage =
                                            sizeOption.requiredQuantity -
                                            (assignedStock?.quantity || 0);

                                        return {
                                            size: `${categoryName}: ${sizeOption.size}`,
                                            shortage: Math.max(shortage, 0),
                                            hasAssigned: !!assignedStock,
                                            isDelivered:
                                                assignedStock?.quantity >=
                                                sizeOption.requiredQuantity,
                                            isAvailableInStock:
                                                !!stockAvailable,
                                        };
                                    }
                                )
                            );
                        })
                    )
                ).flat();

                const assigned = athlete.assignedStock.map((stock) => ({
                    category: stock.category?.categoryName || "Unknown",
                    size: stock.size,
                    quantity: stock.quantity,
                }));

                const isDelivered = assigned.filter((item) =>
                    requirements.some(
                        (req) =>
                            req.size === `${item.category}: ${item.size}` &&
                            req.isDelivered
                    )
                );

                const hasShortage = requirements.some(
                    (req) => req.shortage > 0 && !req.isAvailableInStock
                );
                const hasAssignedNotDelivered = requirements.some(
                    (req) =>
                        req.hasAssigned &&
                        !req.isDelivered &&
                        req.isAvailableInStock
                );
                const hasAllAssignedDelivered = requirements.every(
                    (req) => req.isDelivered
                );

                let status: string;

                if (hasShortage) {
                    status = "NEEDS";
                } else if (hasAssignedNotDelivered) {
                    status = "NOT_DELIVERED";
                } else if (hasAllAssignedDelivered) {
                    status = "ALL_IS_GOOD";
                } else {
                    status = "UNKNOWN";
                }

                return {
                    id: athlete.id,
                    gender: athlete.gender,
                    dateOfBirth: athlete.dateOfBirth,
                    name: `${athlete.firstName} ${athlete.lastName}`,
                    category: genderAndAge,
                    joinedDate: moment(athlete.joinDate).format("YYYY-MM-DD"),
                    status,
                    requirements: requirements.filter(
                        (req) => req.shortage > 0
                    ),
                    assigned,
                    isDelivered,
                };
            })
        );

        return {
            data,
            meta: paginationResult.meta,
        };
    }

    async getClothesNeeded(sportId: string): Promise<any> {
        const categories = await this.categoryRepository.find({
            where: { sportClubProfile: { id: sportId } },
            relations: ["stocks"],
        });

        const clothesNeeded = [];

        for (const category of categories) {
            const sizesNeeded: Record<
                string,
                { size: string; quantity: number; inStock: boolean }
            > = {};

            const athleteCategorySizes =
                await this.athleteCategorySizeRepository.find({
                    where: { category: { id: category.id } },
                });

            for (const athleteCategory of athleteCategorySizes) {
                for (const sizeOption of athleteCategory.sizeOptions) {
                    const key = `${category.id}:${sizeOption.size}`;

                    if (!sizesNeeded[key]) {
                        sizesNeeded[key] = {
                            size: sizeOption.size,
                            quantity: 0,
                            inStock: false,
                        };
                    }

                    sizesNeeded[key].quantity += sizeOption.requiredQuantity;
                }
            }

            const assignedStocks = await this.athleteStockRepository.find({
                where: { category: { id: category.id } },
            });

            for (const stock of assignedStocks) {
                const key = `${category.id}:${stock.size}`;

                if (sizesNeeded[key]) {
                    sizesNeeded[key].quantity -= stock.quantity;
                }
            }

            const stockForCategory = await this.stockRepository.findOne({
                where: { category: { id: category.id } },
            });

            if (stockForCategory) {
                for (const sizeOption of stockForCategory.sizeOptions) {
                    const key = `${category.id}:${sizeOption.size}`;

                    if (sizesNeeded[key]) {
                        sizesNeeded[key].inStock = true;
                    }
                }
            }

            const sizes = Object.values(sizesNeeded).filter(
                (size) => size.quantity > 0
            );

            if (sizes.length > 0) {
                clothesNeeded.push({
                    category: category.categoryName,
                    sizes,
                });
            }
        }

        const summary = {
            allIsGood: 0,
            notDelivered: 0,
            needsClothes: clothesNeeded.reduce(
                (total, item) =>
                    total +
                    item.sizes.reduce((sum, size) => sum + size.quantity, 0),
                0
            ),
        };

        return { clothesNeeded, summary };
    }

    async addSizeToCategory(
        categoryId: string,
        size: string,
        requiredQuantity: number
    ) {
        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
        });

        if (!category) {
            throw new NotFoundException(
                `Category with ID ${categoryId} not found`
            );
        }

        const existingSize = category.sizeOptions.find(
            (option) => option.size === size
        );

        if (existingSize) {
            throw new BadRequestException(
                `Size ${size} already exists in category ${categoryId}`
            );
        }

        category.sizeOptions.push({ size, requiredQuantity });

        return this.categoryRepository.save(category);
    }

    async getStockCategories(sportId: string): Promise<SportCategory[]> {
        const query = this.categoryRepository.createQueryBuilder("category");

        query.where("category.sportClubProfileId = :sportId", { sportId });

        return query.getMany();
    }

    async getStock(
        filter?: {
            categoryId?: string;
            sportId?: string;
        },
        options?: IPaginationOptions,
        sortField?: string,
        sortOrder?: "ASC" | "DESC"
    ): Promise<Pagination<Stock>> {
        const page = options?.page ?? 1;
        const limit = options?.limit ?? 10;

        const queryBuilder = this.stockRepository
            .createQueryBuilder("stock")
            .leftJoinAndSelect("stock.category", "category");

        if (filter?.categoryId) {
            queryBuilder.andWhere("stock.categoryId = :categoryId", {
                categoryId: filter.categoryId,
            });
        }

        if (filter?.sportId) {
            queryBuilder.andWhere("category.sportClubProfileId = :sportId", {
                sportId: filter.sportId,
            });
        }

        if (sortField) {
            queryBuilder.orderBy(`stock.${sortField}`, sortOrder || "DESC");
        }

        const totalItems = await queryBuilder.getCount();

        const paginationResult = await paginate<Stock>(queryBuilder as any, {
            page,
            limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
            metaTransformer: ({ currentPage, itemCount, itemsPerPage }) => {
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                return {
                    currentPage,
                    itemCount,
                    itemsPerPage,
                    totalPages: totalPages === 0 ? 1 : totalPages,
                    totalItems,
                };
            },
        });

        if (!paginationResult.items.length) {
            throw new NotFoundException(
                "No stock found for the provided filters."
            );
        }

        return paginationResult;
    }

    async addStock(createStockDto: CreateStockDto): Promise<Stock> {
        const { sportId, categoryId, measurementUnit, sizeOptions } =
            createStockDto;

        if (!sportId) {
            throw new BadRequestException("Sport ID is required.");
        }

        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
            relations: ["sportClubProfile"],
        });

        if (!category) {
            throw new NotFoundException(
                `Category not found for ID: ${categoryId}`
            );
        }

        if (category.sportClubProfile.id !== sportId) {
            throw new BadRequestException(
                `Sport ID ${sportId} does not match the category's sport club profile.`
            );
        }

        sizeOptions.forEach((option) => {
            if (
                !category.sizeOptions.some(
                    (sizeOption) => sizeOption.size === option.size
                )
            ) {
                throw new BadRequestException(
                    `Size ${option.size} is not valid for category ID: ${categoryId}`
                );
            }
        });

        const totalQuantity = sizeOptions.reduce(
            (sum, option) => sum + option.quantity,
            0
        );

        const stock = this.stockRepository.create({
            category,
            sportClubProfile: category.sportClubProfile,
            measurementUnit,
            sizeOptions,
            totalQuantity,
        });

        return this.stockRepository.save(stock);
    }

    async updateStock(
        id: string,
        updateStockDto: UpdateStockDto
    ): Promise<Stock> {
        const { categoryId, measurementUnit, sizeOptions } = updateStockDto;

        const stock = await this.stockRepository.findOne({
            where: { id },
            relations: ["category"],
        });

        if (!stock) {
            throw new NotFoundException(`Stock with ID ${id} not found.`);
        }

        if (categoryId && categoryId !== stock.category.id) {
            const category = await this.categoryRepository.findOne({
                where: { id: categoryId },
            });
            if (!category) {
                throw new NotFoundException(
                    `Category with ID ${categoryId} not found.`
                );
            }
            stock.category = category;
        }

        if (measurementUnit) {
            stock.measurementUnit = measurementUnit;
        }

        if (sizeOptions) {
            const category = stock.category;
            sizeOptions.forEach((option) => {
                const isValidSize = category.sizeOptions.some(
                    (categoryOption) => categoryOption.size === option.size
                );
                if (!isValidSize) {
                    throw new BadRequestException(
                        `Size '${option.size}' is not valid for category ID: ${category.id}.`
                    );
                }
            });

            stock.sizeOptions = sizeOptions;
            stock.totalQuantity = sizeOptions.reduce(
                (sum, option) => sum + option.quantity,
                0
            );
        }

        return this.stockRepository.save(stock);
    }
    async getStockSummarizedData(sportId: string): Promise<
        Array<{
            categoryId: string;
            categoryName: string;
            totalQuantity: number;
            sizeBreakdown: Array<{ size: string; quantity: number }>;
        }>
    > {
        const categories = await this.categoryRepository.find({
            where: { sportClubProfile: { id: sportId } },
            relations: ["stocks"],
        });

        if (!categories.length) {
            throw new NotFoundException(
                `No categories found for sport ID: ${sportId}`
            );
        }

        const dashboardData = categories.map((category) => {
            const sizeBreakdown = category.sizeOptions.map((sizeOption) => {
                const totalQuantityForSize = category.stocks.reduce(
                    (sum, stock) => {
                        const sizeOptionInStock = stock.sizeOptions.find(
                            (option) => option.size === sizeOption.size
                        );
                        return sum + (sizeOptionInStock?.quantity || 0);
                    },
                    0
                );

                return {
                    size: sizeOption.size,
                    quantity: totalQuantityForSize,
                };
            });

            const totalQuantity = sizeBreakdown.reduce(
                (sum, breakdown) => sum + breakdown.quantity,
                0
            );

            return {
                categoryId: category.id,
                categoryName: category.categoryName,
                totalQuantity,
                sizeBreakdown,
            };
        });

        return dashboardData;
    }

    async deleteStock(id: string): Promise<void> {
        const stock = await this.stockRepository.findOne({ where: { id } });

        if (!stock) {
            throw new NotFoundException("Stock not found");
        }

        await this.stockRepository.remove(stock);
    }
}
