import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { Language, UserRole } from "src/enums/users.enum";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ default: "", example: "", required: false })
    username?: string;

    @ApiProperty({ default: "", example: "", required: false })
    email?: string;

    @ApiProperty({
        default: "",
        example: "",
        required: false,
        readOnly: true,
    })
    password?: string;

    @ApiProperty({ default: "", example: "", required: false })
    phoneNumber?: string;

    @ApiProperty({ default: "", example: "", required: false })
    role?: UserRole;

    @ApiProperty({ required: false, enum: Language })
    language?: Language;

    @ApiProperty({ default: "", example: "", required: false })
    notification?: boolean;

    @ApiProperty({
        description: "",
        required: false,
    })
    avatar?: string;

    // --- Relational fields ---
    @ApiProperty({
        required: false,
        default: "",
        description: "enter the related academy ID",
    })
    academy?: string;
}
