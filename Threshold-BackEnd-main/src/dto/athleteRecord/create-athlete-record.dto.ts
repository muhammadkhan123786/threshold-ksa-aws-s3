import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsEnum, IsOptional } from "class-validator";
import { SportProfileType } from "src/enums/athletes.enum";

export class CreateAthleteRecordDto {
    @IsEnum(SportProfileType)
    @IsOptional()
    @ApiProperty({
        description:
            "Specifies the sport category linked to the athlete's profile. This value must correspond to a valid entry from the SportProfileType enum.",
        example: SportProfileType.RUNNING,
        required: false,
        enum: SportProfileType,
    })
    category?: SportProfileType;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description:
            "Specifies the subcategory of the sport associated with the athlete's profile. This is an optional field and can be used to further specify the category.",
        example: "Sprint",
        required: false,
    })
    subcategory?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description:
            "Represents the athlete's personal best record within the selected category. This value should reflect the athlete's highest achievement to date.",
        example: 123.45,
        required: false,
    })
    personalRecord?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description:
            "Denotes the best record in the specified category, which may be the athlete's or a contextual best. This value should be the highest recorded performance.",
        example: 130.67,
        required: false,
    })
    bestRecord?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description:
            "Captures the most recent performance record of the athlete within this category. This value reflects the latest achievement.",
        example: 120.34,
        required: false,
    })
    lastRecord?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description:
            "The name of the event where the performance was recorded. This field is optional and can include events like 'National Championship 2024'.",
        example: "National Championship 2024",
        required: false,
    })
    eventName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description:
            "The place where the event took place. This field is optional and can include locations like 'Riyadh Stadium'.",
        example: "Riyadh Stadium",
        required: false,
    })
    eventPlace?: string;
}
