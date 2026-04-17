import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum } from "class-validator";
import { SportProfileType } from "src/enums/athletes.enum";

export class CreateSportProfileDto {
    @IsEnum(SportProfileType)
    @ApiProperty({
        enum: SportProfileType,
        description: "The sport associated with this profile.",
        example: SportProfileType.FOOTBALL,
        required: true,
    })
    sport: SportProfileType;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "The hand preference for the athlete (e.g., left, right). This field is optional.",
        example: "right",
        required: false,
        nullable: true,
    })
    hand?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "The foot preference for the athlete (e.g., left, right). This field is optional.",
        example: "left",
        required: false,
        nullable: true,
    })
    foot?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "The position the athlete typically plays (e.g., midfielder, goalkeeper). This field is optional.",
        example: "midfielder",
        required: false,
        nullable: true,
    })
    position?: string;

    @IsString()
    @ApiProperty({
        description:
            "The ID of the academy associated with this sport profile.",
        example: "acad-1234",
        required: true,
    })
    academy: string;
}
