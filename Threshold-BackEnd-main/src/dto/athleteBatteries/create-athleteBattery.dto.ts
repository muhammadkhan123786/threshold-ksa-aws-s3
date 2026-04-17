import { IsDate, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateAthleteBatteryDto {
    // --- Original fields ---
    @IsInt()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid pacer.",
        example: "Sample pacer",
        required: true,
    })
    pacer: string;

    @IsInt()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid sit.",
        example: "Sample sit",
        required: true,
    })
    sit: string;

    @IsInt()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid trunk.",
        example: "Sample trunk",
        required: true,
    })
    trunk: string;

    @IsInt()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid push.",
        example: "Sample push",
        required: true,
    })
    push: string;

    @IsInt()
    @ApiProperty({
        required: true,
        description: "",
        default: "placeholder",
        example: "placeholder",
    })
    @ApiProperty({
        description: "Provide a valid curl.",
        example: "Sample curl",
        required: true,
    })
    curl: string;

    @IsDate()
    @ApiProperty({
        required: true,
        description: "",
        default: new Date().toLocaleDateString(),
        example: new Date().toLocaleDateString(),
    })
    @ApiProperty({
        description: "Provide a valid date.",
        example: "Sample date",
        required: true,
    })
    date: string;

    // --- Relational fields ---
    @ApiProperty({
        required: true,
        description: "enter the related athlete ID",
    })
    @ApiProperty({
        description: "Provide a valid athlete.",
        example: "Sample athlete",
        required: true,
    })
    athlete: string;
}
