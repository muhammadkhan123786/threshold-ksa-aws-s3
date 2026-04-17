import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class GetTeamPlayersQueryDto {
    @ApiProperty({ example: 1, description: "Page number", required: false })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page?: number;

    @ApiProperty({
        example: 10,
        description: "Number of players per page",
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit?: number;

    @ApiProperty({
        example: "Ahmed",
        description: "Search by player name",
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;
}
