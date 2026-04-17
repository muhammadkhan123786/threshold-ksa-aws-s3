import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsDateString, IsOptional, IsString } from "class-validator";
import {
    ContractType,
    ContractStatus,
    ContractDuration,
} from "src/entities/contract.entity";

export class CreateContractDto {
    @ApiProperty({
        description: "The type of contract",
        enum: ContractType,
        enumName: "ContractType",
    })
    @IsEnum(ContractType)
    type: ContractType;

    @ApiProperty({
        description: "The join date (ISO format)",
        type: String,
        format: "date",
    })
    @IsDateString()
    joinDate: string;

    @ApiProperty({
        description: "The expiration date (ISO format)",
        type: String,
        format: "date",
    })
    @IsOptional()
    @IsDateString()
    expirationDate?: string;

    @ApiProperty({
        description: "The duration of the contract",
        enum: ContractDuration,
        enumName: "ContractDuration",
    })
    @IsEnum(ContractDuration)
    contractDuration: ContractDuration;

    @ApiProperty({
        description: "URL of the contract document (if any)",
    })
    @IsOptional()
    @IsString()
    contractUrl?: string;

    @ApiProperty({
        description: "The current status of the contract",
        enum: ContractStatus,
        enumName: "ContractStatus",
    })
    @IsEnum(ContractStatus)
    status: ContractStatus;
}

export class UpdateContractDto {
    @ApiPropertyOptional({
        description: "The type of contract",
        enum: ContractType,
        enumName: "ContractType",
    })
    @IsOptional()
    @IsEnum(ContractType)
    type?: ContractType;

    @ApiPropertyOptional({
        description: "The join date (ISO format)",
        type: String,
        format: "date",
    })
    @IsOptional()
    @IsDateString()
    joinDate?: string;

    @ApiPropertyOptional({
        description: "The expiration date (ISO format)",
        type: String,
        format: "date",
    })
    @IsOptional()
    @IsDateString()
    expirationDate?: string;

    @ApiPropertyOptional({
        description: "The duration of the contract",
        enum: ContractDuration,
        enumName: "ContractDuration",
    })
    @IsOptional()
    @IsEnum(ContractDuration)
    contractDuration?: ContractDuration;

    @ApiPropertyOptional({
        description: "URL of the contract document (if any)",
    })
    @IsOptional()
    @IsString()
    contractUrl?: string;

    @ApiPropertyOptional({
        description: "The current status of the contract",
        enum: ContractStatus,
        enumName: "ContractStatus",
    })
    @IsOptional()
    @IsEnum(ContractStatus)
    status?: ContractStatus;
}
