import { ApiProperty } from "@nestjs/swagger";
import { ClubSessionStatus } from "../../entities/clubSession.entity";
import { Transform } from "class-transformer";
import { Type } from "class-transformer";

export class ClubSessionResponseDto {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Unique identifier of the club session"
    })
    id: string;

    @ApiProperty({
        example: "Advanced Swimming Training - Week 1",
        description: "Title of the club session"
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
        example: "Mission 1: Speed Development",
        description: "Mission associated with this session",
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
    volumeTargeted?: number;

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
        maximum: 10
    })
    @Transform(({ value }) => Number(value))
    averagePE: number;

    @ApiProperty({
        description: "Date of the session",
        example: "2024-03-15",
        type: Date
    })
    @Type(() => Date)
    day: Date;

    @ApiProperty({
        enum: ClubSessionStatus,
        example: ClubSessionStatus.NOT_STARTED,
        description: "Current status of the club session"
    })
    status: ClubSessionStatus;

    @ApiProperty({
        example: "11:00 am",
        description: "Start time of the session",
        pattern: "^(0?[1-9]|1[0-2]):[0-5][0-9]\\s*(am|pm)$"
    })
    startTime: string;

    @ApiProperty({
        example: "12:30 pm",
        description: "End time of the session",
        pattern: "^(0?[1-9]|1[0-2]):[0-5][0-9]\\s*(am|pm)$"
    })
    endTime: string;

    @ApiProperty({
        example: "Focus on technique and endurance. Bring goggles and swim cap.",
        description: "Additional notes about the session",
        required: false,
        maxLength: 1000
    })
    notes?: string;

    @ApiProperty({
        example: "2024-03-15T14:00:00Z",
        description: "Timestamp when the session was created",
        type: Date
    })
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty({
        example: "2024-03-15T14:00:00Z",
        description: "Timestamp when the session was last updated",
        type: Date
    })
    @Type(() => Date)
    updatedAt: Date;
}
