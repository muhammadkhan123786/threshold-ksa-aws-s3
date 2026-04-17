import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid token.",
        example: "Sample token",
        required: true,
    })
    token: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid password.",
        example: "Sample password",
        required: true,
    })
    password: string;
}
