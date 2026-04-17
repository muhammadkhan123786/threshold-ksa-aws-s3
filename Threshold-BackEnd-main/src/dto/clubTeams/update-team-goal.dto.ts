import { PartialType } from "@nestjs/swagger";
import { CreateTeamGoalDto } from "./create-team-goal.dto";

import { AddSubGoalDto } from "./add-sub-goal.dto";

export class UpdateTeamGoalDto extends PartialType(CreateTeamGoalDto) {}

export class UpdateSubGoalDto extends PartialType(AddSubGoalDto) {}
