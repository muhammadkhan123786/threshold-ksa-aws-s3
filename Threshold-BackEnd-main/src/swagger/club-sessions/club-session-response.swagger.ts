import { ApiProperty } from "@nestjs/swagger";
import { ClubSessionStatus } from "../../entities/clubSession.entity";
import { Type, Transform } from "class-transformer";

export class ClubSessionResponseDto {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Unique identifier of the club session"
    })
    id: string;

    @ApiProperty({
        example: "Technical Skills Development - Week 12",
        description: "Title of the session"
    })
    title: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440001",
        description: "ID of the team associated with this session"
    })
    teamId: string;

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440002",
        description: "ID of the template used for this session"
    })
    templateId: string;

    @ApiProperty({
        enum: ClubSessionStatus,
        example: ClubSessionStatus.NOT_STARTED,
        description: "Current status of the session"
    })
    status: ClubSessionStatus;

    @ApiProperty({ 
        example: "2024-03-15T14:00:00Z",
        description: "Session start time",
        type: Date
    })
    @Type(() => Date)
    startTime: Date;

    @ApiProperty({ 
        example: "2024-03-15T15:30:00Z",
        description: "Session end time",
        type: Date
    })
    @Type(() => Date)
    endTime: Date;

    @ApiProperty({
        description: "List of spaces/venues where the session is held",
        example: ["Main Training Ground", "Secondary Field", "Indoor Gym"],
        type: [String],
        isArray: true,
        minItems: 1,
        maxItems: 10,
        examples: {
            single: {
                value: ["Main Training Ground"],
                description: "Single venue"
            },
            multiple: {
                value: ["Main Training Ground", "Secondary Field", "Indoor Gym"],
                description: "Multiple venues"
            }
        }
    })
    spaces: string[];

    @ApiProperty({
        description: "Mission associated with this session",
        example: "Mission 1: Speed Development",
        required: false
    })
    missionAssociated?: string;

    @ApiProperty({ 
        example: 10000,
        description: "Volume targeted for this session",
        type: Number,
        required: false
    })
    @Transform(({ value }) => Number(value))
    volumeTargeted: number;

    @ApiProperty({ 
        example: 7.5,
        description: "Average perceived exertion (scale 1-10)",
        type: Number,
        minimum: 0,
        maximum: 10
    })
    @Transform(({ value }) => Number(value))
    averagePE: number;

    @ApiProperty({
        description: "Phase results and measurements",
        example: [{
            phaseId: "ph-1234567890-0",
            phaseName: "Warm-up",
            target: 15,
            techniques: [{
                name: "Dynamic Stretching",
                value: "15",
                unit: "minutes",
                results: [{
                    playerId: "550e8400-e29b-41d4-a716-446655440003",
                    value: 12
                }]
            }],
            athleteRecords: [{
                athleteId: "550e8400-e29b-41d4-a716-446655440003",
                athleteName: "John Doe",
                measurements: {
                    speed: 85,
                    accuracy: 90
                }
            }]
        }],
        required: false
    })
    phaseResults?: {
        phaseId: string;
        phaseName: string;
        target?: number;
        techniques: {
            name: string;
            value: string;
            unit: string;
            results: {
                playerId: string;
                value: number;
            }[];
        }[];
        athleteRecords: {
            athleteId: string;
            athleteName: string;
            measurements: Record<string, number>;
        }[];
    }[];

    @ApiProperty({
        description: "Positions invited to this session",
        example: ["Forward", "Midfielder"],
        type: [String],
        required: false
    })
    invitedPositions?: string[];

    @ApiProperty({
        description: "Additional notes about the session",
        example: "Focus on technique and form",
        required: false,
        maxLength: 1000
    })
    notes?: string;

    @ApiProperty({ 
        example: "2024-03-15T14:00:00Z",
        description: "When the session was created",
        type: Date
    })
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty({ 
        example: "2024-03-15T14:00:00Z",
        description: "When the session was last updated",
        type: Date
    })
    @Type(() => Date)
    updatedAt: Date;
}
