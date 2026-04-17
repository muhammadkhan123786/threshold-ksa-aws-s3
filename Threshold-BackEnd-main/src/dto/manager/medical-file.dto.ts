import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateMedicalFileDto {
    @ApiProperty({
        example: "Annual Health Check Report",
        description: "Description of the medical file",
    })
    @IsString()
    description: string;
}

export class UpdateMedicalFileDto {
    @ApiProperty({
        example: "Updated Health Check Report",
        description: "Updated description of the medical file",
    })
    @IsOptional()
    @IsString()
    description?: string;
}
