import { IsInt, Min, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class PaginationParams {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsInt()
    @Min(1, { message: "Page number must be at least 1" })
    @ApiProperty({
        description: "Page number for pagination",
        example: 1,
        required: false,
    })
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsInt()
    @Min(1, { message: "Limit must be at least 1" })
    @ApiProperty({
        description: "Number of items per page",
        example: 10,
        required: false,
    })
    limit?: number;
}
