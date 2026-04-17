import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

export class SubmitPlayerFeedbackDto {
    @ApiProperty({
        description: "Player's ID",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    @IsUUID()
    @IsNotEmpty()
    playerId: string;

    @ApiProperty({
        description: "Player's perceived exertion scale (1-10)",
        example: 7,
        minimum: 1,
        maximum: 10
    })
    @IsNumber()
    @Min(1)
    @Max(10)
    scale: number;

    @ApiProperty({
        description: "Player's note about the session",
        example: "Great session, felt challenging but achievable"
    })
    @IsString()
    note: string;
} 