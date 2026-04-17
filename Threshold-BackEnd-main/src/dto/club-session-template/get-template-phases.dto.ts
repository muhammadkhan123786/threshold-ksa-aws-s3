import { ApiProperty } from "@nestjs/swagger";

export class TechniqueResponseDto {
    @ApiProperty({ example: "Speed", description: "Name of the technique" })
    name: string;

    @ApiProperty({ example: "100", description: "Value of the technique" })
    value: string;

    @ApiProperty({ example: "meters", description: "Unit of measurement" })
    unit: string;
}

export class PhaseResponseDto {
    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", description: "Unique identifier of the phase" })
    id: string;

    @ApiProperty({ example: "Curl-up", description: "Name of the phase" })
    name: string;

    @ApiProperty({ example: "Description of the phase", description: "Description of the phase" })
    description: string;

    @ApiProperty({ example: 1, description: "Order of the phase in the sequence" })
    order: number;

    @ApiProperty({ example: "100 meters", description: "Target value for the phase" })
    target: string;

    @ApiProperty({ type: [TechniqueResponseDto], description: "List of techniques in this phase" })
    techniques: TechniqueResponseDto[];

    @ApiProperty({ example: "1 technique", description: "Summary of techniques count" })
    techniqueSummary: string;
}

export class GetTemplatePhasesResponseDto {
    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", description: "Template ID" })
    id: string;

    @ApiProperty({ example: "Training Session Template", description: "Name of the template" })
    name: string;

    @ApiProperty({ type: [PhaseResponseDto], description: "List of phases in this template" })
    phases: PhaseResponseDto[];
} 