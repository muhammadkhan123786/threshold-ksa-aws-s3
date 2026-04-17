import { IsUUID, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationParams } from "src/types/paginationParams";

export class GetAthleteClothingStatusDto extends PaginationParams {
    @ApiProperty({
        description: "Filter by sport ID",
        example: "f2d1a67b-d1ef-4d1a-8c7a-92bb1c1e401d",
    })
    @IsNotEmpty()
    @IsUUID("4", { message: "Sport ID must be a valid UUID" })
    sportId: string;
}
