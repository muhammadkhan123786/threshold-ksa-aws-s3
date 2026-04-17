import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdatePublicAthleteLinkStatusDto {
    @IsBoolean()
    @ApiProperty({
        description: "Provide a valid isActive.",
        example: "True",
        required: true,
    })
    isActive: boolean;
}
