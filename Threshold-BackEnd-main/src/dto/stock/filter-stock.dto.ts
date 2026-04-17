import { IsOptional, IsUUID, IsInt, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FilterStockDto {
    @IsOptional()
    @IsUUID()
    @ApiProperty({
        description: "Filter by category ID (optional)",
        example: "e3f9a1e2-17c8-4e0b-b4c2-3a8f0adbd78e",
        required: false,
    })
    categoryId?: string;

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        description: "Filter by sport ID (optional)",
        example: "d3b8a7c6-89d4-4e5e-8f2b-c6b8f7d4e5e8",
        required: false,
    })
    sportId?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty({
        description: "Page number for pagination (optional)",
        example: 1,
        required: false,
    })
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiProperty({
        description: "Number of items per page (optional)",
        example: 10,
        required: false,
    })
    limit?: number;
}
