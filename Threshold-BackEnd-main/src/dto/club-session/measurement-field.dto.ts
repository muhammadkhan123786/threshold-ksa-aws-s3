import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, IsOptional, IsEnum, Min, Max } from 'class-validator';

export enum CalculationMethod {
    AVERAGE = 'AVERAGE',
    SUM = 'SUM',
    MAX = 'MAX',
    MIN = 'MIN',
    LAST = 'LAST',
    WEIGHTED_AVERAGE = 'WEIGHTED_AVERAGE'
}

export class MeasurementTarget {
    @ApiProperty({ 
        description: 'Target value for this measurement',
        example: 85
    })
    @IsNumber()
    value: number;

    @ApiProperty({ 
        description: 'Minimum acceptable value',
        example: 70
    })
    @IsNumber()
    min: number;

    @ApiProperty({ 
        description: 'Maximum acceptable value',
        example: 100
    })
    @IsNumber()
    max: number;

    @ApiProperty({ 
        description: 'Weight for weighted average calculations',
        example: 1.0,
        required: false
    })
    @IsOptional()
    @IsNumber()
    weight?: number;
}

export class MeasurementFieldDto {
    @ApiProperty({ description: 'Unique identifier for the measurement field' })
    @IsString()
    fieldId: string;

    @ApiProperty({ description: 'Display name of the measurement field' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Detailed description of what this field measures' })
    @IsString()
    description: string;

    @ApiProperty({ 
        description: 'Unit of measurement',
        example: 'percentage',
        enum: ['percentage', 'score', 'bpm', 'seconds', 'meters', 'kilograms', 'count']
    })
    @IsString()
    unit: string;

    @ApiProperty({
        description: 'How the final value should be calculated from multiple measurements',
        enum: CalculationMethod,
        example: CalculationMethod.AVERAGE
    })
    @IsEnum(CalculationMethod)
    calculationMethod: CalculationMethod;

    @ApiProperty({
        description: 'Target configuration for this measurement',
        type: MeasurementTarget
    })
    @IsObject()
    target: MeasurementTarget;

    @ApiProperty({ description: 'Whether this field must be filled' })
    @IsOptional()
    required?: boolean;
} 