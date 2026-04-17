import { IntersectionType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { CreateAcademyDto } from "../academies/create-academy.dto";

export class RegisterDto extends IntersectionType(
    CreateUserDto,
    CreateAcademyDto
) {}
