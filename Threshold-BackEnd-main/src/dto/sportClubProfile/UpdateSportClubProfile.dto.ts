import { PartialType } from "@nestjs/swagger";
import { CreateSportClubProfileDto } from "./CreateSportClubProfile.dto";

export class UpdateSportClubProfileDto extends PartialType(
    CreateSportClubProfileDto
) {}
