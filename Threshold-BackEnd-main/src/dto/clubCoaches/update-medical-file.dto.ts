import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateMedicalFileDto {
    @ApiProperty({
        description: "Optional description of the medical file",
        example: "Medical Report for surgery",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
