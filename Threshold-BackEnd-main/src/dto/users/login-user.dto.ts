import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";

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

export class PasswordDto {
    @Length(6, 25)
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    @ApiProperty({
        example: "s5Rsa2?#sd1154",
        description: "Password must contains at least 6 characters.",
        required: true,
    })
    @ApiProperty({
        description: "Provide a valid password.",
        example: "Sample password",
        required: true,
    })
    password: string;
}

export class LoginUserDto extends IntersectionType(EmailDto, PasswordDto) {}
