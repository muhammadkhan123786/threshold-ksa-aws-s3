import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsArray,
    IsOptional,
    ValidateNested,
    IsNumber,
    IsEnum,
    IsBoolean,
    Min,
    Max,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export enum PhaseCalculationMethod {
    SUM = "SUM",
    AVERAGE = "AVERAGE",
    MAX = "MAX",
    MIN = "MIN",
    LAST = "LAST",
    WEIGHTED_AVERAGE = "WEIGHTED_AVERAGE",
}

class ValidationDto {
    @ApiProperty({
        example: 0,
        description: "Minimum allowed value",
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    min?: number;

    @ApiProperty({
        example: 100,
        description: "Maximum allowed value",
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    max?: number;

    @ApiProperty({
        example: true,
        description: "Whether the field is required",
    })
    @IsBoolean()
    required: boolean;
}

class FieldDto {
    @ApiProperty({
        example: "Distance",
        description: "Name of the measurement field",
    })
    @IsString()
    name: string;

    @ApiProperty({ example: "400", description: "Value for the field" })
    @IsString()
    value: string;

    @ApiProperty({ example: "meters", description: "Unit of measurement" })
    @IsString()
    unit: string;
}

class TechniqueDto {
    @ApiProperty({
        example: "Distance",
        description: "Name of the technique",
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "Description of the technique",
        description: "Detailed description of the technique",
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 400,
        description: "Default value for the technique",
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    defaultValue?: number;

    @ApiProperty({
        example: "400",
        description: "Value for the technique",
    })
    @IsString()
    value: string;

    @ApiProperty({
        example: "meters",
        description: "Unit of measurement",
    })
    @IsString()
    unit: string;

    @ApiProperty({
        type: ValidationDto,
        description: "Validation rules for the technique",
        required: false,
    })
    @ValidateNested()
    @Type(() => ValidationDto)
    @IsOptional()
    validation?: ValidationDto;
}

export class PhaseDto {
    @ApiProperty({
        example: "ph-001",
        description: "Unique identifier of the phase",
        required: false
    })
    @IsString()
    @IsOptional()
    id?: string;

    @ApiProperty({
        example: "Warm-up",
        description: "Name of the phase",
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "Detailed description of the warm-up phase",
        description: "Description of the phase",
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 1,
        description: "Order of the phase in the session",
    })
    @IsNumber()
    @Transform(({ value }) => Number(value))
    order: number;

    @ApiProperty({
        example: "minutes",
        description: "Unit of measurement for the phase",
    })
    @IsString()
    unit: string;

    @ApiProperty({
        example: 15,
        description: "Target value for the phase",
    })
    @IsNumber()
    @Transform(({ value }) => Number(value))
    target: number;

    @ApiProperty({
        type: [TechniqueDto],
        description: "Techniques included in this phase",
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechniqueDto)
    techniques: TechniqueDto[];

    @ApiProperty({
        enum: PhaseCalculationMethod,
        example: PhaseCalculationMethod.AVERAGE,
        description: "How to calculate the phase result",
        required: false,
    })
    @IsEnum(PhaseCalculationMethod)
    @IsOptional()
    calculationMethod?: PhaseCalculationMethod;
}

export class CreateSessionTemplateDto {
    @ApiProperty({
        example: "Advanced Swimming Training",
        description: "Name of the template",
    })
    @IsString()
    name: string;

    @ApiProperty({
        example:
            "Complete swimming workout including warm-up, main sets, and cool down",
        description: "Detailed description of the template",
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        type: [PhaseDto],
        description: "Training phases in this template",
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhaseDto)
    phases: PhaseDto[];
}

export class UpdateSessionTemplateDto extends CreateSessionTemplateDto {}

export class AddPhaseDto extends PhaseDto {}
