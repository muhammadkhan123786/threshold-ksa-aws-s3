import { PartialType } from "@nestjs/swagger";
import { CreateClubAdminDto } from "./create-club-admin.dto";

export class UpdateClubAdminDto extends PartialType(CreateClubAdminDto) {}
