import { PartialType } from "@nestjs/swagger";
import { CreateClubTeamDto } from "./create-club-team.dto";

export class UpdateClubTeamDto extends PartialType(CreateClubTeamDto) {}
