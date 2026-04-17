import { IsOptional, IsPositive, IsInt, IsString, IsIn } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetClubCoachesQueryDto {
    @ApiPropertyOptional({
        name: "search",
        description: "Partial name to filter club coaches by first or last name",
        example: "John",
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        name: "page",
        description: "Page number for pagination",
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    page?: number = 1;

    @ApiPropertyOptional({
        name: "limit",
        description: "Number of items per page",
        example: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    limit?: number = 10;

    @ApiPropertyOptional({
        name: "sortField",
        description: "Field to sort by",
        example: "firstName",
    })
    @IsOptional()
    @IsString()
    sortField?: string = "firstName";

    @ApiPropertyOptional({
        name: "sortOrder",
        description: "Order of sorting: ASC or DESC",
        example: "ASC",
        enum: ["ASC", "DESC"],
    })
    @IsOptional()
    @IsIn(["ASC", "DESC"])
    sortOrder?: "ASC" | "DESC" = "ASC";
}