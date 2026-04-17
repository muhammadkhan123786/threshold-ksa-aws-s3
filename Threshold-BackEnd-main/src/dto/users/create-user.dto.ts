import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { LoginUserDto } from "./login-user.dto";
import { Language, UserRole } from "src/enums/users.enum";

export class CreateUserDto extends IntersectionType(LoginUserDto) {
    @ApiProperty({
        description:
            "The username of the user. Must be between 5 and 25 characters.",
        example: "john_doe",
        required: true,
    })
    @IsString()
    username: string;

    @IsOptional()
    @IsEnum(UserRole)
    @ApiProperty({
        description:
            "The role assigned to the user. Valid roles include ADMIN, ACADEMY_ADMIN, CLUB_ADMIN, etc.",
        example: UserRole.ACADEMY_ADMIN,
        enum: UserRole,
        required: false,
    })
    role?: UserRole;

    @IsOptional()
    @IsEnum(Language)
    @ApiProperty({
        description:
            "Preferred language for the user. Defaults to Arabic ('ARABIC').",
        example: Language.ARABIC,
        enum: Language,
        default: Language.ARABIC,
        required: false,
    })
    language?: Language;

    @IsOptional()
    @ApiProperty({
        description:
            "Indicates if the user should receive notifications. Defaults to false.",
        example: true,
        required: false,
    })
    notification?: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description:
            "Base64-encoded string representing the user's avatar image.",
        example:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QBVRXhpZgAATU0AKgAAAAgABAE7AAIAAAASAAAISodpAAQA...",
        required: false,
    })
    avatar?: string;

    // --- Relational fields ---
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "The name of the academy associated with the user.",
        example: "Example Academy",
        required: false,
    })
    academy?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "The ID of the branch associated with the user.",
        example: "branch-1234",
        required: false,
    })
    branch_id?: string;

    @IsEnum(["academy", "club"])
    @ApiProperty({
        description:
            "The type of organization the user is associated with. Either 'academy' or 'club'.",
        example: "academy",
        enum: ["academy", "club"],
        required: true,
    })
    organizationType?: "academy" | "club";
}
