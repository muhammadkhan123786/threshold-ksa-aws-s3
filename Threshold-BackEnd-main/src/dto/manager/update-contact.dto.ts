import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateContactDto {
    @ApiProperty({ example: "+123456789", description: "Phone number of the manager" })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: "+987654321", description: "Emergency contact phone number" })
    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @ApiProperty({ example: "manager@example.com", description: "Email address of the manager" })
    @IsOptional()
    @IsString()
    email?: string;

    // Add other fields as necessary
} 