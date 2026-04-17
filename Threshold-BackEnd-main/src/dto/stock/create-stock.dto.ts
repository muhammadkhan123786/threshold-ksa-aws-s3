import {
    IsArray,
    IsUUID,
    IsInt,
    Min,
    ValidateNested,
    IsNotEmpty,
    IsString,
    IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { MeasurementUnit, ClothingSize, ShoeSize } from "src/enums/stock.enum";

export class SizeOptionDto {
    @ApiProperty({
        description: "Size of the stock item (e.g., L, XL, custom string)",
        example: "L",
    })
    @IsString({ message: "Size must be a string" })
    @IsNotEmpty({ message: "Size is required" })
    size: ClothingSize | ShoeSize | string;

    @ApiProperty({
        description: "Quantity of the size option",
        example: 100,
    })
    @IsInt({ message: "Quantity must be an integer" })
    @Min(1, { message: "Quantity must be at least 1" })
    quantity: number;
}

export class CreateStockDto {
    @ApiProperty({
        description: "ID of the sport club profile",
        example: "f2d1a67b-d1ef-4d1a-8c7a-92bb1c1e401d",
    })
    @IsUUID("4", { message: "Sport ID must be a valid UUID" })
    @IsNotEmpty({ message: "Sport ID is required" })
    sportId: string;

    @ApiProperty({
        description: "ID of the category",
        example: "3ec8c5cf-b136-47fc-b8bb-0ab6a98cb23c",
    })
    @IsUUID("4", { message: "Category ID must be a valid UUID" })
    @IsNotEmpty({ message: "Category ID is required" })
    categoryId: string;

    @ApiProperty({
        description: "Measurement unit of the stock",
        example: "EU",
    })
    @IsEnum(MeasurementUnit, {
        message: "Measurement unit must be a valid enum value",
    })
    @IsNotEmpty({ message: "Measurement unit is required" })
    measurementUnit: MeasurementUnit;

    @ApiProperty({
        description: "Array of size options for the stock",
        type: [SizeOptionDto],
        example: [
            {
                size: "L",
                quantity: 100,
            },
            {
                size: "XL",
                quantity: 50,
            },
        ],
    })
    @IsArray({ message: "Size options must be an array" })
    @ValidateNested({ each: true })
    @Type(() => SizeOptionDto)
    @IsNotEmpty({ message: "Size options are required" })
    sizeOptions: SizeOptionDto[];
}
