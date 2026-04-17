import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    Res,
    UseGuards,
    HttpStatus,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { StockService } from "./stock.service";
import { UpdateStockDto } from "src/dto/stock/update-stock.dto";
import { CreateStockDto } from "src/dto/stock/create-stock.dto";
import {
    SwaggerAddSize,
    SwaggerGetStockCategories,
    SwaggerGetStock,
    SwaggerAddStock,
    SwaggerUpdateStock,
    SwaggerDeleteStock,
    SwaggerGetClothesNeeded,
    SwaggerGetClothingStatus,
    SwaggerGetAthleteStockFields,
    SwaggerUpdateOrCreateAthleteStock,
    SwaggerGetStockSummarizedData,
} from "./swagger-decorators";
import { GetStockCategoriesDto } from "src/dto/stock/get-stock-categories.dto";
import { GetStockDto } from "src/dto/stock/get-stock.dto";
import { GetAthleteClothingStatusDto } from "src/dto/stock/get-cloath.dto";

@ApiTags("Stock")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("stock")
export class StockController {
    constructor(private readonly stockService: StockService) {}

    @Get("summarized")
    @SwaggerGetStockSummarizedData()
    async getDashboardData(
        @Res() res: Response,
        @Query("sportId") sportId: string
    ) {
        try {
            const dashboardData =
                await this.stockService.getStockSummarizedData(sportId);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Summarized stock data retrieved successfully",
                data: dashboardData,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve summarized stock data",
                error: error.message,
            });
        }
    }

    @Post("/update-or-create")
    @SwaggerUpdateOrCreateAthleteStock()
    async updateOrCreateAthleteStock(
        @Body()
        body: {
            athleteId: string;
            stockData: Array<{
                categoryId: string;
                size: string;
                quantity: number;
            }>;
        }
    ) {
        return this.stockService.updateOrCreateAthleteStock(
            body.athleteId,
            body.stockData
        );
    }
    @Get("fields")
    @SwaggerGetAthleteStockFields()
    async getAthleteStockFields(@Query("athleteId") athleteId: string) {
        return this.stockService.getAthleteStockFields(athleteId);
    }

    @SwaggerGetClothingStatus()
    @Get("clothing-status")
    async getAthleteClothingStatus(
        @Res() res: Response,
        @Query() query: GetAthleteClothingStatusDto
    ) {
        try {
            const result = await this.stockService.getAthleteClothingStatus({
                sportId: query.sportId,
                paginationParams: { limit: query.limit, page: query.page },
            });

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Athlete clothing statuses retrieved successfully",
                result,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while retrieving clothing statuses",
                error: error.message,
            });
        }
    }

    @SwaggerGetClothesNeeded()
    @Get("clothes/summarized/:sportId")
    async getClothesNeeded(@Param("sportId") sportId: string) {
        return this.stockService.getClothesNeeded(sportId);
    }

    @Post("sizes")
    @SwaggerAddSize()
    async addSize(
        @Body()
        addSizeDto: {
            categoryId: string;
            size: string;
            requiredQuantity: number;
        },
        @Res() res: Response
    ) {
        try {
            const { categoryId, size, requiredQuantity } = addSizeDto;

            if (!categoryId || !size || requiredQuantity === undefined) {
                return res.status(400).json({
                    success: false,
                    message:
                        "categoryId, size, and requiredQuantity are required",
                });
            }

            const updatedCategory = await this.stockService.addSizeToCategory(
                categoryId,
                size,
                requiredQuantity
            );

            return res.status(201).json({
                success: true,
                message: "Size added successfully",
                data: updatedCategory,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An error occurred while adding size",
                error: error.message,
            });
        }
    }

    @Get("categories")
    @SwaggerGetStockCategories()
    async getStockCategories(
        @Res() res: Response,
        @Query() query: GetStockCategoriesDto
    ) {
        try {
            const categories = await this.stockService.getStockCategories(
                query.sportId
            );
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Stock categories retrieved successfully.",
                data: categories,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve stock categories.",
                error: error.message,
            });
        }
    }
    @Get()
    @SwaggerGetStock()
    async getStock(@Res() res: Response, @Query() query: GetStockDto) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;
            const sortField = query.sortField || "createdAt";
            const sortOrder = (query.sortOrder as "ASC" | "DESC") || "DESC";

            const paginatedResult = await this.stockService.getStock(
                {
                    categoryId: query.categoryId,
                    sportId: query.sportId,
                },
                { page, limit },
                sortField,
                sortOrder
            );

            return res.status(200).json({
                success: true,
                message: "Stock retrieved successfully",
                data: paginatedResult.items,
                meta: paginatedResult.meta,
                links: paginatedResult.links,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An error occurred while retrieving stock",
                error: error.message,
            });
        }
    }
    @Post()
    @SwaggerAddStock()
    async addStock(
        @Body() createStockDto: CreateStockDto,
        @Res() res: Response
    ) {
        try {
            const stock = await this.stockService.addStock(createStockDto);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Stock added successfully",
                data: stock,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
                error: error.stack,
            });
        }
    }
    @Patch(":id")
    @SwaggerUpdateStock()
    async updateStock(
        @Param("id") id: string,
        @Body() updateStockDto: UpdateStockDto,
        @Res() res: Response
    ) {
        try {
            const updatedStock = await this.stockService.updateStock(
                id,
                updateStockDto
            );
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Stock updated successfully",
                data: updatedStock,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
        }
    }

    @Delete(":id")
    @SwaggerDeleteStock()
    async deleteStock(@Param("id") id: string, @Res() res: Response) {
        try {
            await this.stockService.deleteStock(id);
            return res.status(200).json({
                success: true,
                message: "Stock deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An error occurred while deleting stock",
                error: error.message,
            });
        }
    }
}
