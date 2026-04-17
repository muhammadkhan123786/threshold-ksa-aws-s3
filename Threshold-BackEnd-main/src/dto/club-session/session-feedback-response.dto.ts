import { ApiProperty } from "@nestjs/swagger";
import { ClubSessionStatus } from "../../entities/clubSession.entity";

export class PlayerFeedbackDto {
    @ApiProperty({
        description: "Player's ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    playerId: string;

    @ApiProperty({
        description: "Player's full name",
        example: "John Doe",
    })
    playerName: string;

    @ApiProperty({
        description: "Player's perceived exertion scale (1-10)",
        example: 7,
    })
    scale: number;

    @ApiProperty({
        description: "Player's note about the session",
        example: "Great session, felt challenging but achievable",
    })
    note: string;

    @ApiProperty({
        description: "Timestamp when the feedback was submitted",
        example: "2024-03-17T12:00:00Z",
    })
    submittedAt: Date;
}

export class SessionFeedbackResponseDto {
    @ApiProperty({
        description: "Session ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    sessionId: string;

    @ApiProperty({
        description: "Session status",
        enum: ClubSessionStatus,
        example: ClubSessionStatus.FINISHED,
    })
    status: ClubSessionStatus;

    @ApiProperty({
        description: "Average perceived exertion of all players",
        example: 7.5,
    })
    averagePE: number;

    @ApiProperty({
        description: "List of player feedback",
        type: [PlayerFeedbackDto],
    })
    feedback: PlayerFeedbackDto[];
}
