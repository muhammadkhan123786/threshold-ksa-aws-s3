import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { MeasurementUnit } from "src/enums/stock.enum";

class SizeOptionDto {
    @ApiProperty({
        description: "Size of the stock item (e.g., M, L, XL).",
        example: "M",
    })
    size: string;

    @ApiProperty({
        description: "Quantity for the specified size.",
        example: 150,
    })
    quantity: number;
}

export class UpdateStockDto {
    @ApiProperty({
        description: "Category ID of the stock item.",
        example: "c3f1ab29-9d87-4c9f-bc7b-9e673ce98356",
        required: false,
    })
    @IsOptional()
    categoryId?: string;

    @ApiProperty({
        description: "Updated measurement unit for the stock.",
        example: "EU",
        required: false,
    })
    @IsOptional()
    @IsEnum(MeasurementUnit, {
        message: "Measurement unit must be a valid enum value.",
    })
    measurementUnit?: MeasurementUnit;

    @ApiProperty({
        description: "List of size options to update.",
        type: [SizeOptionDto],
        example: [
            { size: "M", quantity: 150 },
            { size: "L", quantity: 100 },
            { size: "XL", quantity: 50 },
        ],
        required: false,
    })
    @IsOptional()
    @IsArray({ message: "Size options must be an array." })
    @ValidateNested({ each: true })
    @Type(() => SizeOptionDto)
    sizeOptions?: SizeOptionDto[];
}
