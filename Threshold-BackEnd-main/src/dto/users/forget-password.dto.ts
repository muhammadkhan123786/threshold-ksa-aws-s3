import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class EmailDto {
    @IsEmail()
    @ApiProperty({ example: "example@example.com", required: true })
    @ApiProperty({
        description: "Provide a valid email.",
        example: "Sample email",
        required: true,
    })
    email: string;
}

export class ForgetPasswordDto extends IntersectionType(EmailDto) {}
