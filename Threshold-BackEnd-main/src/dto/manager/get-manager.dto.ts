import { IsOptional, IsUUID, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationParams } from "src/types/paginationParams";

export class GetManagersDto extends PaginationParams {
    @ApiProperty({
        description: "ID of the branch (optional)",
        example: "a3b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        required: false,
    })
    @IsOptional()
    @IsString({ message: "Branch ID must be a string" })
    branchId?: string;
}
