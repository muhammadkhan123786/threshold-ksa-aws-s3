import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsObject,
} from "class-validator";
import { AuditAction } from "src/entities/contractAudit.entity";

export class CreateContractAuditDto {
    @ApiProperty({
        description: "Action performed on the contract",
        enum: AuditAction,
        example: AuditAction.UPDATED,
    })
    @IsEnum(AuditAction)
    @IsNotEmpty()
    action: AuditAction;

    @ApiProperty({
        description: "Previous values before changes (for auditing)",
        required: false,
        example: {
            type: "Temporary",
            status: "Active",
            expirationDate: "2023-12-31",
        },
    })
    @IsObject()
    @IsOptional()
    previousValues?: any;

    @ApiProperty({
        description: "New values after changes (for auditing)",
        required: false,
        example: {
            type: "Permanent",
            status: "Active",
            expirationDate: null,
        },
    })
    @IsObject()
    @IsOptional()
    newValues?: any;

    @ApiProperty({
        description: "Comments about the changes",
        required: false,
        example: "Changed from temporary to permanent contract due to performance",
    })
    @IsString()
    @IsOptional()
    comments?: string;
}

export class GetContractAuditQueryDto {
    @ApiProperty({
        description: "Contract ID to filter audit logs",
        required: false,
    })
    @IsString()
    @IsOptional()
    contractId?: string;

    @ApiProperty({
        description: "Action type to filter",
        enum: AuditAction,
        required: false,
    })
    @IsEnum(AuditAction)
    @IsOptional()
    action?: AuditAction;

    @ApiProperty({
        description: "Page number for pagination",
        default: 1,
        required: false,
    })
    @IsOptional()
    page?: number = 1;

    @ApiProperty({
        description: "Number of items per page",
        default: 10,
        required: false,
    })
    @IsOptional()
    limit?: number = 10;
} 