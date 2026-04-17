import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional } from "class-validator";
import { ClothingSize } from "src/enums/clothing-size";

export class CreateClothingDataDto {
    @IsEnum(ClothingSize)
    @IsOptional()
    @ApiPropertyOptional({
        description:
            "Provide a valid tShirtSize. Example values are 's', 'm', 'l', etc.",
        example: ClothingSize.M,
    })
    tShirtSize?: ClothingSize;

    @IsEnum(ClothingSize)
    @IsOptional()
    @ApiPropertyOptional({
        description:
            "Provide a valid pantSize. Example values are 'xs', 'l', 'xxl', etc.",
        example: ClothingSize.L,
    })
    pantSize?: ClothingSize;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description:
            "Provide a valid shoeSize. Example values: '42', '9.5', '8'.",
        example: "42",
    })
    shoeSize?: string;

    @IsEnum(ClothingSize)
    @IsOptional()
    @ApiPropertyOptional({
        description:
            "Provide a valid driFitSize. Example values are 'm', 'xl', 'xxl', etc.",
        example: ClothingSize.M,
    })
    driFitSize?: ClothingSize;
}
