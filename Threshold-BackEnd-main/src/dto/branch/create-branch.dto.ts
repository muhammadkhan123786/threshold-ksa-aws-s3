import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBranchDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @ApiProperty({
        description: "Provide a valid name.",
        example: "Sample name",
        required: true,
    })
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}
