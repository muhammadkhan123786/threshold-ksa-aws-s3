import { ApiProperty } from '@nestjs/swagger';
import { PhaseCalculationMethod } from '../../dto/club-session-template.dto';

export class FieldExample {
    @ApiProperty({
        example: 'Distance',
        description: 'Name of the measurement field'
    })
    name: string;

    @ApiProperty({
        example: '400',
        description: 'Value for the field'
    })
    value: string;

    @ApiProperty({
        example: 'meters',
        description: 'Unit of measurement'
    })
    unit: string;
}

export class TechniqueExample {
    @ApiProperty({
        example: 'Freestyle Drill',
        description: 'Name of the technique'
    })
    name: string;

    @ApiProperty({
        example: 'Focus on form and breathing',
        description: 'Description of the technique'
    })
    description: string;

    @ApiProperty({
        example: '400',
        description: 'Value for the technique'
    })
    value: string;

    @ApiProperty({
        example: 'meters',
        description: 'Unit of measurement'
    })
    unit: string;

    @ApiProperty({
        example: 400,
        description: 'Default value for the technique',
        required: false
    })
    defaultValue?: number;
}

export class PhaseExample {
    @ApiProperty({
        example: 'ph-001',
        description: 'Unique identifier of the phase'
    })
    id: string;

    @ApiProperty({
        example: 'Warm Up',
        description: 'Name of the training phase'
    })
    name: string;

    @ApiProperty({
        example: 'Dynamic stretching and light swimming',
        description: 'Description of the phase'
    })
    description: string;

    @ApiProperty({
        example: 1,
        description: 'Order of this phase in the session'
    })
    order: number;

    @ApiProperty({
        example: 'meters',
        description: 'Unit of measurement for this phase'
    })
    unit: string;

    @ApiProperty({
        example: 400,
        description: 'Target value for this phase'
    })
    target: number;

    @ApiProperty({
        example: PhaseCalculationMethod.AVERAGE,
        description: 'Method to calculate the final phase result',
        enum: PhaseCalculationMethod,
        default: PhaseCalculationMethod.AVERAGE
    })
    calculationMethod: PhaseCalculationMethod;

    @ApiProperty({
        type: [TechniqueExample],
        description: 'Techniques included in this phase'
    })
    techniques: TechniqueExample[];
}

export class CreateSessionTemplateExample {
    @ApiProperty({
        example: 'swimming-001',
        description: 'Sport profile ID this template belongs to'
    })
    sportProfileId: string;

    @ApiProperty({
        example: 'Advanced Swimming Training',
        description: 'Name of the session template'
    })
    name: string;

    @ApiProperty({
        example: 'Complete swimming workout including warm-up, main sets, and cool down',
        description: 'Description of the session template'
    })
    description: string;

    @ApiProperty({
        type: [PhaseExample],
        description: 'Training phases in this template',
        example: [{
            name: 'Warm Up',
            description: 'Dynamic stretching and light swimming',
            order: 1,
            unit: 'meters',
            target: 400,
            calculationMethod: PhaseCalculationMethod.AVERAGE,
            techniques: [{
                name: 'Freestyle Drill',
                description: 'Focus on form and breathing',
                defaultValue: 400,
                fields: [{
                    name: 'Distance',
                    value: '400',
                    unit: 'meters'
                }]
            }]
        }]
    })
    phases: PhaseExample[];
}

export class SessionTemplateResponseExample extends CreateSessionTemplateExample {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Unique identifier of the template'
    })
    id: string;

    @ApiProperty({
        example: 'swimming-001',
        description: 'Sport profile this template belongs to'
    })
    sportProfileId: string;

    @ApiProperty({
        example: '2024-03-08T12:00:00Z',
        description: 'When the template was created'
    })
    createdAt: Date;

    @ApiProperty({
        example: '2024-03-08T12:00:00Z',
        description: 'When the template was last updated'
    })
    updatedAt: Date;
} 