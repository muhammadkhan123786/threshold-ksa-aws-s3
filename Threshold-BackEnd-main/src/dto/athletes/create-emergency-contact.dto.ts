import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional } from "class-validator";
import { Relationship } from "src/enums/athletes.enum";

export class CreateEmergencyContactDto {
    @IsString()
    @ApiProperty({
        description: "Provide the name of the emergency contact.",
        example: "John Doe",
        required: true,
    })
    name: string;

    @ApiProperty({
        description: "Relationship to the athlete",
        example: "Father",
        required: false,
    })
    @IsString()
    @IsOptional()
    relationship?: string;

    // Alias for backward compatibility
    get relation(): string | undefined {
        return this.relationship;
    }

    @IsString()
    @ApiProperty({
        description: "Provide a valid phone number for the emergency contact.",
        example: "+512312313",
        required: true,
    })
    phoneNumber: string;

    @IsString()
    @ApiProperty({
        description: "Provide a valid national identification number.",
        example: "123456789",
        required: true,
    })
    nationalNumber: string;
}
