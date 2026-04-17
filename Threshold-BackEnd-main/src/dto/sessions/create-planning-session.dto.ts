import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePlanningSessionDto {
    @ApiProperty({
        required: true,
        description: "Title of the planning session",
    })
    @IsString()
    @ApiProperty({
        description: "Provide a valid title.",
        example: "Sample title",
        required: true,
    })
    title: string;

    @ApiProperty({
        required: false,
        description: "Description of the planning session",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        required: false,
        description: "Theme of the planning session",
    })
    @IsOptional()
    @IsString()
    theme?: string;

    @ApiProperty({
        required: false,
        description: "Space used for the planning session",
    })
    @IsOptional()
    @IsString()
    space?: string;

    @ApiProperty({
        required: false,
        description: "Training load for the planning session",
    })
    @IsOptional()
    @IsString()
    trainingLoad?: string;

    @ApiProperty({
        required: false,
        description: "Time load for the planning session",
    })
    @IsOptional()
    @IsString()
    timeLoad?: string;

    @ApiProperty({
        required: false,
        description: "Base64 encoded image for the drill",
    })
    @IsOptional()
    @IsString()
    drillImage?: string;

    @ApiProperty({
        required: false,
        description: "User who created the planning session",
    })
    @IsOptional()
    @IsString()
    createdBy?: string;
}
