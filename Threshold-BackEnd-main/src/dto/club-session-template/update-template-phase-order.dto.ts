import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
    Min,
    MaxLength,
    MinLength,
    IsOptional,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class UpdateTemplatePhaseDto {
    @ApiProperty({
        description: "Phase identifier",
        example: "phase-1",
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: "Phase name",
        example: "Curl-up",
        minLength: 1,
        maxLength: 100,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(100)
    name?: string;

    @ApiProperty({
        description: "Phase order in the template",
        example: 1,
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => Number(value))
    order: number;
}

export class UpdateTemplatePhaseOrderRequestDto {
    @ApiProperty({
        description: "List of phases with their new order and names",
        type: [UpdateTemplatePhaseDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateTemplatePhaseDto)
    phases: UpdateTemplatePhaseDto[];
}
