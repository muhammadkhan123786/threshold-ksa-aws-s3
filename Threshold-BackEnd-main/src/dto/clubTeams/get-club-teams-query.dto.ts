import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetClubTeamsQueryDto {
    @ApiPropertyOptional({
        name: "search",
        description: "Search query for team name or coach's name",
        example: "Tigers",
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
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        name: "limit",
        description: "Number of items per page",
        example: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        name: "sortField",
        description: "Field to sort by",
        example: "createdAt",
        enum: ["name", "createdAt", "updatedAt"],
    })
    @IsOptional()
    @IsString()
    sortField?: string = "createdAt";

    @ApiPropertyOptional({
        name: "sortOrder",
        description: "Order of sorting",
        example: "DESC",
        enum: ["ASC", "DESC"],
    })
    @IsOptional()
    @IsEnum(["ASC", "DESC"])
    sortOrder?: "ASC" | "DESC" = "DESC";
}