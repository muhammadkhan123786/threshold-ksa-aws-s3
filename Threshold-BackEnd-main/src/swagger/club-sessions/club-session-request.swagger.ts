import { ApiProperty } from "@nestjs/swagger";
import { ClubSessionStatus } from "../../entities/clubSession.entity";
import { Type, Transform } from "class-transformer";

export class CreateSessionRequestDto {
    @ApiProperty({
        description: "Team identifier",
        example: "team-550e8400-e29b-41d4-a716-446655440000",
    })
    teamId: string;

    @ApiProperty({
        description: "Mission associated with this session",
        example: "Mission 1: Speed Development",
        required: false,
    })
    missionAssociated?: string;

    @ApiProperty({
        description: "Volume targeted for this session",
        example: 10000,
        type: Number,
        required: false,
    })
    @Transform(({ value }) => Number(value))
    volumeTargeted?: number;

    @ApiProperty({
        description: "Session type template identifier",
        example: "550e8400-e29b-41d4-a716-446655440002",
    })
    templateId: string;

    @ApiProperty({
        description: "Title of the session",
        example: "Advanced Swimming Training - Week 1",
        minLength: 3,
        maxLength: 100,
    })
    title: string;

    @ApiProperty({
        description: "List of spaces/venues where the session will be held",
        example: ["Olympic Pool - Lane 1-4", "Gym Area"],
        type: [String],
        isArray: true,
        minItems: 1,
        maxItems: 10,
        examples: {
            single: {
                value: ["Olympic Pool - Lane 1-4"],
                description: "Single venue"
            },
            multiple: {
                value: ["Olympic Pool - Lane 1-4", "Gym Area"],
                description: "Multiple venues"
            }
        }
    })
    spaces: string[];

    @ApiProperty({
        description: "Average perceived exertion (scale 1-10)",
        example: 7.5,
        type: Number,
        minimum: 0,
        maximum: 10,
    })
    @Transform(({ value }) => Number(value))
    averagePE: number;

    @ApiProperty({
        description: "Date of the session",
        example: "2024-03-15",
        type: Date,
    })
    @Type(() => Date)
    day: Date;

    @ApiProperty({
        description: "Start time of the session",
        example: "11:00 am",
        pattern: "^(0?[1-9]|1[0-2]):[0-5][0-9]\\s*(am|pm)$",
    })
    startTime: string;

    @ApiProperty({
        description: "End time of the session",
        example: "12:30 pm",
        pattern: "^(0?[1-9]|1[0-2]):[0-5][0-9]\\s*(am|pm)$",
    })
    endTime: string;

    @ApiProperty({
        description: "Additional notes about the session",
        example: "Focus on technique and endurance. Bring goggles and swim cap.",
        required: false,
        maxLength: 1000,
    })
    notes?: string;

    @ApiProperty({
        description: "Positions invited to this session",
        example: ["Forward", "Midfielder"],
        type: [String],
        required: false,
    })
    invitedPositions?: string[];
}

export class UpdateSessionRequestDto {
    @ApiProperty({
        description: "Title of the session",
        example: "Technical Skills Development - Week 12 (Updated)",
        required: false,
    })
    title?: string;

    @ApiProperty({
        description: "Start time of the session",
        example: "2024-03-15T14:30:00Z",
        type: Date,
        required: false,
    })
    @Type(() => Date)
    startTime?: Date;

    @ApiProperty({
        description: "End time of the session",
        example: "2024-03-15T16:00:00Z",
        type: Date,
        required: false,
    })
    @Type(() => Date)
    endTime?: Date;

    @ApiProperty({
        description: "Session status",
        enum: ClubSessionStatus,
        example: ClubSessionStatus.IN_PROGRESS,
        required: false,
    })
    status?: ClubSessionStatus;

    @ApiProperty({
        description: "Volume targeted for this session",
        example: 10000,
        type: Number,
        required: false,
    })
    @Transform(({ value }) => (value ? Number(value) : undefined))
    volumeTargeted?: number;

    @ApiProperty({
        description: "Average perceived exertion (scale 1-10)",
        example: 7.5,
        type: Number,
        minimum: 0,
        maximum: 10,
        required: false,
    })
    @Transform(({ value }) => (value ? Number(value) : undefined))
    averagePE?: number;

    @ApiProperty({
        description: "List of spaces/venues where the session will be held",
        example: ["Olympic Pool - Lane 1-4", "Gym Area"],
        type: [String],
        isArray: true,
        required: false,
        minItems: 1,
        maxItems: 10,
        examples: {
            single: {
                value: ["Olympic Pool - Lane 1-4"],
                description: "Single venue",
            },
            multiple: {
                value: ["Olympic Pool - Lane 1-4", "Gym Area"],
                description: "Multiple venues",
            },
        },
    })
    spaces?: string[];

    @ApiProperty({
        description: "Positions invited to this session",
        example: ["Midfielder", "Forward", "Defender"],
        type: [String],
        required: false,
    })
    invitedPositions?: string[];

    @ApiProperty({
        description: "Additional notes about the session",
        example: "Updated focus on defensive positioning and transitions",
        required: false,
        maxLength: 1000,
    })
    notes?: string;
}

export class UpdateSessionResultsRequestDto {
    @ApiProperty({
        example: [
            {
                phaseId: "ph-1234567890-0",
                phaseName: "Warm-up",
                techniques: [
                    {
                        name: "Dynamic Stretching",
                        value: "15",
                        unit: "minutes",
                        results: [
                            {
                                playerId:
                                    "550e8400-e29b-41d4-a716-446655440003",
                                value: 12,
                            },
                        ],
                    },
                ],
                athleteRecords: [
                    {
                        athleteId: "550e8400-e29b-41d4-a716-446655440003",
                        athleteName: "John Doe",
                        measurements: {
                            speed: 85,
                            accuracy: 90,
                        },
                    },
                ],
            },
        ],
    })
    phaseResults: {
        phaseId: string;
        phaseName: string;
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
}

export class DateRangeRequestDto {
    @ApiProperty({
        example: "2025-03-01T00:00:00Z",
        description: "Start date for the range query",
    })
    startDate: Date;

    @ApiProperty({
        example: "2025-03-31T23:59:59Z",
        description: "End date for the range query",
    })
    endDate: Date;
}

export class UpdateTemplatePhaseDto {
    @ApiProperty({
        description: "Phase identifier",
        example: "phase-1",
    })
    id: string;

    @ApiProperty({
        description: "Phase name",
        example: "Curl-up",
        minLength: 1,
        maxLength: 100,
    })
    name: string;

    @ApiProperty({
        description: "Phase order in the template",
        example: 1,
        minimum: 1,
    })
    @Transform(({ value }) => Number(value))
    order: number;
}

export class UpdateTemplatePhaseOrderRequestDto {
    @ApiProperty({
        description: "List of phases with their new order and names",
        type: [UpdateTemplatePhaseDto],
        example: [
            {
                id: "phase-1",
                name: "Curl-up",
                order: 1,
            },
            {
                id: "phase-2",
                name: "Push up",
                order: 2,
            },
            {
                id: "phase-3",
                name: "Trunck-lift",
                order: 3,
            },
            {
                id: "phase-4",
                name: "Sit & Reach",
                order: 4,
            },
            {
                id: "phase-5",
                name: "Pacer",
                order: 5,
            },
        ],
    })
    phases: UpdateTemplatePhaseDto[];
}
