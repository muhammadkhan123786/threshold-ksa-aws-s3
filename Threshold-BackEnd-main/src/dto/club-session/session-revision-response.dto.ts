import { ApiProperty } from "@nestjs/swagger";
import { ClubSessionStatus } from "../../entities/clubSession.entity";

export class RevisionRecordResponseDto {
    @ApiProperty({
        description: "Player's Rate of Perceived Exertion (1-10)",
        example: 7
    })
    rpe: number;

    @ApiProperty({
        description: "Player's note about the session",
        example: "Great session, felt challenging but achievable",
        required: false
    })
    note?: string;

    @ApiProperty({
        description: "Player's level",
        example: "Professional",
        required: false
    })
    level: string;

    @ApiProperty({
        description: "Timestamp when the revision was submitted",
        example: "2024-03-17T12:00:00Z"
    })
    submittedAt: Date;
}

export class PlayerRevisionResponseDto {
    @ApiProperty({
        description: "Player's ID",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    playerId: string;

    @ApiProperty({
        description: "Player's full name",
        example: "John Doe"
    })
    playerName: string;

    @ApiProperty({
        description: "Player's position",
        example: "Forward"
    })
    position: string;

    @ApiProperty({
        description: "Player's revision record",
        type: RevisionRecordResponseDto,
        required: false
    })
    record: RevisionRecordResponseDto | null;
}

export class SessionRevisionResponseDto {
    @ApiProperty({
        description: "Session ID",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    sessionId: string;

    @ApiProperty({
        description: "Session title",
        example: "Morning Training Session"
    })
    sessionTitle: string;

    @ApiProperty({
        description: "Sport profile ID",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    sportId: string;

    @ApiProperty({
        description: "Session status",
        example: "completed",
        enum: ClubSessionStatus
    })
    status: ClubSessionStatus;

    @ApiProperty({
        description: "Average Rate of Perceived Exertion across all players",
        example: 7.5
    })
    averageRPE: number;

    @ApiProperty({
        description: "List of player revisions",
        type: [PlayerRevisionResponseDto]
    })
    revisions: PlayerRevisionResponseDto[];
} 