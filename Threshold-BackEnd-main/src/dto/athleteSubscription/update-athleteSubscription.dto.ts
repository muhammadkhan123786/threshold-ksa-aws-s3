import { PartialType } from "@nestjs/swagger";
import { CreateAthleteSubscriptionDto } from "./create-athleteSubscription.dto";

export class UpdateAthleteSubscriptionDto extends PartialType(
    CreateAthleteSubscriptionDto
) {}
