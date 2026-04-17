import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsUUID } from "class-validator";

export class CreatePublicAthleteLinkDto {
    @IsUUID()
    @ApiProperty({
        description: "Provide a valid academyId.",
        example: "Sample academyId",
        required: true,
    })
    academyId: string;

    @IsDate()
    @ApiProperty({
        description: "Provide a valid expirationDate.",
        example: "2023-01-01",
        required: true,
    })
    expirationDate: Date;

    @IsInt()
    @ApiProperty({
        description: "Provide a valid limitNumber.",
        example: "123",
        required: true,
    })
    limitNumber: number;
}
