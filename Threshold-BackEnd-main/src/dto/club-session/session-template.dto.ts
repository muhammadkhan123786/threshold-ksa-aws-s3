import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested, Min, IsOptional, IsUUID, IsEnum, IsNotEmpty, MaxLength, MinLength, ArrayMinSize } from 'class-validator';

export enum CalculationMethod {
    AVERAGE = 'AVERAGE',
    SUM = 'SUM',
    MAX = 'MAX',
    MIN = 'MIN'
}

export class FieldDto {
    @ApiProperty({ 
        description: 'Name of the measurement field',
        example: 'Distance'
    })
    @IsString()
    name: string;

    @ApiProperty({ 
        description: 'Value for the field',
        example: '400'
    })
    @IsString()
    value: string;

    @ApiProperty({ 
        description: 'Unit of measurement',
        example: 'meters'
    })
    @IsString()
    unit: string;
}

export class TechniqueDto {
    @ApiProperty({ 
        description: 'Name of the technique',
        example: 'Distance'
    })
    @IsString()
    name: string;

    @ApiProperty({ 
        description: 'Value for the technique',
        example: '400'
    })
    @IsString()
    value: string;

    @ApiProperty({ 
        description: 'Unit of measurement',
        example: 'meters'
    })
    @IsString()
    unit: string;

    @ApiProperty({ 
        description: 'Additional measurement fields for the technique',
        type: [FieldDto],
        example: [{
            name: 'Distance',
            value: '400',
            unit: 'meters'
        }]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FieldDto)
    fields: FieldDto[];
}

export class PhaseDto {
    @ApiProperty({ 
        description: 'Unique identifier of the phase',
        example: 'ph-001',
        required: false
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({ 
        description: 'Name of the training phase',
        example: 'Warm Up'
    })
    @IsString()
    name: string;

    @ApiProperty({ 
        description: 'Description of the phase',
        example: 'Dynamic stretching and light swimming'
    })
    @IsString()
    description: string;

    @ApiProperty({ 
        description: 'Order of this phase in the session',
        example: 1
    })
    @IsNumber()
    @Min(1)
    order: number;

    @ApiProperty({ 
        description: 'Unit of measurement for this phase',
        example: 'meters'
    })
    @IsString()
    unit: string;

    @ApiProperty({ 
        description: 'Target value for this phase',
        example: 400
    })
    @IsNumber()
    target: number;

    @ApiProperty({
        description: 'Method to calculate the final value',
        enum: CalculationMethod,
        example: CalculationMethod.AVERAGE
    })
    @IsEnum(CalculationMethod)
    calculationMethod: CalculationMethod;

    @ApiProperty({ 
        description: 'Techniques included in this phase',
        type: [TechniqueDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechniqueDto)
    techniques: TechniqueDto[];
}

export class CreateSessionTemplateDto {
    @ApiProperty({ 
        description: 'Sport profile identifier',
        example: 'sp-550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsNotEmpty({ message: "Sport profile ID is required" })
    @IsUUID(undefined, { message: "Invalid sport profile ID format" })
    sportProfileId: string;

    @ApiProperty({ 
        description: 'Name of the session template',
        example: 'Advanced Swimming Training'
    })
    @IsString()
    @IsNotEmpty({ message: "Template name is required" })
    @MinLength(3, { message: "Template name must be at least 3 characters long" })
    @MaxLength(100, { message: "Template name cannot exceed 100 characters" })
    name: string;

    @ApiProperty({ 
        description: 'Description of the session template',
        example: 'Complete swimming workout including warm-up, main sets, and cool down'
    })
    @IsString()
    @IsOptional()
    @MaxLength(1000, { message: "Description cannot exceed 1000 characters" })
    description?: string;

    @ApiProperty({ 
        description: 'Training phases in this template',
        type: [PhaseDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PhaseDto)
    @ArrayMinSize(1, { message: "Template must have at least one phase" })
    phases: PhaseDto[];
}

export class SessionTemplateResponseDto extends CreateSessionTemplateDto {
    @ApiProperty({ 
        description: 'Unique identifier of the template',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsUUID()
    id: string;

    @ApiProperty({ 
        description: 'When the template was created',
        example: '2024-03-08T12:00:00Z'
    })
    createdAt: Date;

    @ApiProperty({ 
        description: 'When the template was last updated',
        example: '2024-03-08T12:00:00Z'
    })
    updatedAt: Date;
} 