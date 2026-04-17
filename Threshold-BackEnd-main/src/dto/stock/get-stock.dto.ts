import { IsOptional, IsString, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationParams } from "src/types/paginationParams";

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC",
}

export class GetStockDto extends PaginationParams {
    @IsString({
        message: ({ property }) => `${property} must be a string`,
    })
    @ApiProperty({
        description: "Filter by sport ID",
        example: "bc9603ac-8e15-492b-9cb6-d14bcaf30567",
    })
    sportId: string;

    @IsOptional()
    @IsString({
        message: ({ property }) => `${property} must be a string`,
    })
    @ApiPropertyOptional({
        description: "Filter by category ID",
        example: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
    })
    categoryId?: string;

    @IsOptional()
    @IsString({
        message: ({ property }) => `${property} must be a string`,
    })
    @ApiPropertyOptional({
        description: "Sort field, e.g., 'createdAt'",
        example: "createdAt",
    })
    sortField?: string;

    @IsOptional()
    @IsEnum(SortOrder, {
        message: ({ property }) => `${property} must be either ASC or DESC`,
    })
    @ApiPropertyOptional({
        description: "Sort order",
        example: "DESC",
        enum: SortOrder,
    })
    sortOrder?: SortOrder;
}
