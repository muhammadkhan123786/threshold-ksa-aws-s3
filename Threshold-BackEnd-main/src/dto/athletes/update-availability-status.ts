import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { AvailabilityStatus } from "src/enums/athletes.enum";

export class UpdateAvailabilityStatusDto {
    @IsEnum(AvailabilityStatus)
    @ApiProperty({
        description: "Provide a valid availability status.",
        example: AvailabilityStatus.available,
        required: true,
    })
    availabilityStatus: AvailabilityStatus;
}
