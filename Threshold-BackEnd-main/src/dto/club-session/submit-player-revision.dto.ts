import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    Max,
    Min,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    IsInt,
    IsOptional,
} from "class-validator";
import { Exclude, Transform, Type } from "class-transformer";

export class RevisionRecordDto {
    @ApiProperty({
        description: "Player's Rate of Perceived Exertion (1-10)",
        example: 7,
        minimum: 1,
        maximum: 10,
    })
    @IsInt()
    @Min(1)
    @Max(10)
    @Transform(({ value }) => Number(value))
    rpe: number;

    @ApiProperty({
        description: "Player's note about the session (optional)",
        example: "Great session, felt challenging but achievable",
        required: false,
    })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({
        description: "Player's level",
        example: "Professional",
        required: false,
    })
    @IsOptional()
    @IsString()
    level?: string;

    @Exclude()
    submittedAt?: Date;
}

export class PlayerRevisionDto {
    @ApiProperty({
        description: "Player's ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsUUID()
    @IsNotEmpty()
    playerId: string;

    @ApiProperty({
        description: "Player's level",
        example: "Professional",
        required: false,
    })
    @IsOptional()
    @IsString()
    level?: string;

    @ApiProperty({
        description: "Player's revision record",
        type: RevisionRecordDto,
    })
    @ValidateNested()
    @Type(() => RevisionRecordDto)
    record: RevisionRecordDto;
}

export class SubmitPlayerRevisionDto {
    @ApiProperty({
        description: "List of player revisions",
        type: [PlayerRevisionDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PlayerRevisionDto)
    @ArrayMinSize(1)
    revisions: PlayerRevisionDto[];
}
