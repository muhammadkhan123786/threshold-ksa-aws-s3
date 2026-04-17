import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsOptional,
    IsUUID,
    IsEnum,
    IsBoolean,
} from "class-validator";
import { SportProfileType } from "src/enums/athletes.enum";

export class CreateSportClubProfileDto {
    @ApiProperty({
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Unique ID of the academy",
    })
    @IsUUID()
    academyId: string;

    @ApiProperty({
        example: SportProfileType.FOOTBALL,
        description: "Type of the sport associated with the club",
        enum: SportProfileType,
    })
    @IsEnum(SportProfileType)
    sportName: SportProfileType;

    @ApiProperty({
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Unique ID of the manager",
    })
    @IsUUID()
    sportProfileManagerId: string;

    @ApiProperty({
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Unique ID of the manager",
    })
    @IsUUID()
    technicalDirectorId: string;

    @ApiProperty({
        example: true,
        description:
            "Whether the sport club profile is active and visible in GET APIs",
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    active?: boolean = true;
}
