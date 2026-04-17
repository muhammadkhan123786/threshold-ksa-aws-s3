import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from "src/enums/team-category.enum";
import { TeamCategory } from "src/enums/team.enum";
import { Transform } from "class-transformer";

export class CreateClubTeamDto {
    @ApiPropertyOptional({
        description: "Branch ID associated with the team",
        example: "123e4567-e89b-12d3-a456-426614174000",
        type: "string",
        format: "uuid",
    })
    @IsOptional()
    branch?: string;

    @ApiPropertyOptional({
        description: "Academy ID associated with the team",
        example: "123e4567-e89b-12d3-a456-426614174001",
        type: "string",
        format: "uuid",
    })
    @IsOptional()
    academy?: string;

    @ApiPropertyOptional({
        description: "Coach ID of the team",
        example: "123e4567-e89b-12d3-a456-426614174002",
        type: "string",
        format: "uuid",
    })
    @IsUUID()
    @IsOptional()
    coach?: string;

    @ApiPropertyOptional({
        description: "Admin ID of the team",
        example: "123e4567-e89b-12d3-a456-426614174002",
        type: "string",
        format: "uuid",
    })
    @IsUUID()
    @IsOptional()
    admin?: string;

    @ApiPropertyOptional({
        description:
            "List of sub-coach IDs associated with the team. Can be provided as comma-separated string or array.",
        example: [
            "123e4567-e89b-12d3-a456-426614174003",
            "123e4567-e89b-12d3-a456-426614174004",
        ],
        type: [String],
        format: "uuid",
    })
    @IsOptional()
    @IsArray()
    @IsUUID("all", { each: true })
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    subCoaches?: string[];

    @ApiPropertyOptional({
        description:
            "List of athlete IDs associated with the team. Can be provided as comma-separated string or array.",
        example: [
            "123e4567-e89b-12d3-a456-426614174005",
            "123e4567-e89b-12d3-a456-426614174006",
        ],
        type: [String],
        format: "uuid",
    })
    @IsOptional()
    @IsArray()
    @IsUUID("all", { each: true })
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    athletes?: string[];

    @ApiProperty({
        description: "Name of the team",
        example: "Al-Hilal U19",
        type: "string",
        required: true,
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: "URL or path of the team's logo image",
        example: "https://example.com/logo.png",
        type: "string",
    })
    @IsString()
    @IsOptional()
    logo?: string;

    @ApiPropertyOptional({
        description: "Background information or description of the team",
        example:
            "The youth team of Al-Hilal football club, focusing on player development",
        type: "string",
    })
    @IsString()
    @IsOptional()
    background?: string;

    @ApiPropertyOptional({
        description: "Gender of the team (male - للذكور | female - للإناث)",
        enum: Gender,
        enumName: "Gender",
        example: Gender.MALE,
    })
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @ApiPropertyOptional({
        description: `Team category:
cubs - اشبال
buds - براعم
juniors - ناشئين
youth - شباب
first_team - فريق اول`,
        enum: TeamCategory,
        enumName: "TeamCategory",
        example: TeamCategory.FIRST_TEAM,
    })
    @IsEnum(TeamCategory)
    @IsOptional()
    category?: TeamCategory;
}
