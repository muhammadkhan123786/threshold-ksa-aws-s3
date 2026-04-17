import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateMedicalFileDto {
    @ApiProperty({
        description: "Optional description of the medical file",
        example: "Medical Report for surgery",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
