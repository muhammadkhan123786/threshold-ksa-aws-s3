import { PartialType } from "@nestjs/swagger";
import { CreateClubCoachDto } from "./create-club-coach.dto";

export class UpdateClubCoachDto extends PartialType(CreateClubCoachDto) {}
