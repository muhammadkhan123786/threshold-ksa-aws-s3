import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetStockCategoriesDto {
    @ApiProperty({
        description: "The ID of the sport for filtering stock categories",
        type: String,
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    sportId: string;
}
