import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Consideration, FoodAllergies, YesNo } from "src/enums/athletes.enum";

export class UpdateMedicalInfoDto {
    @IsOptional()
    @IsEnum(YesNo)
    @ApiProperty({
        description: "Indicates whether the athlete has allergies (Yes/No).",
        example: YesNo.YES,
        enum: YesNo,
        required: false,
    })
    allergies?: YesNo;

    @IsOptional()
    @IsEnum(YesNo)
    @ApiProperty({
        description:
            "Indicates whether the athlete has chronic diseases (Yes/No).",
        example: YesNo.YES,
        enum: YesNo,
        required: false,
    })
    chronicDisease?: YesNo;

    @IsOptional()
    @IsEnum(FoodAllergies)
    @ApiProperty({
        description: "Details of the athlete's food allergies.",
        example: FoodAllergies.PEANUTS,
        enum: FoodAllergies,
        required: false,
    })
    foodAllergies?: FoodAllergies;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "URL to a document related to the athlete's food allergies.",
        example:
            "https://s3.amazonaws.com/bucketname/athleteId/foodAllergies.pdf",
        required: false,
    })
    foodAllergiesUrl?: string;

    @IsOptional()
    @IsEnum(Consideration)
    @ApiProperty({
        description:
            "Specific considerations related to the athlete's condition.",
        example: Consideration.AUTISTIC,
        enum: Consideration,
        required: false,
    })
    consideration?: Consideration;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "URL to a document related to the athlete's current consideration.",
        example:
            "https://s3.amazonaws.com/bucketname/athleteId/currentConsideration.pdf",
        required: false,
    })
    considerationUrl?: string;
}
