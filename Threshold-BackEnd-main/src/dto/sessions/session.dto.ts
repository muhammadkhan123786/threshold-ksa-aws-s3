import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    IsArray,
    ValidateNested,
    IsDate,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class SessionRecordDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid athlete.",
        example: "Sample athlete",
        required: true,
    })
    athlete: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid status.",
        example: "Sample status",
        required: true,
    })
    status: string;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid scale.",
        example: "Sample scale",
        required: true,
    })
    scale: string;
}

export class SessionDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid academy.",
        example: "Sample academy",
        required: true,
    })
    academy: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid team.",
        example: "Sample team",
        required: true,
    })
    team: string;

    @IsDate()
    @ApiProperty({
        description: "Provide a valid date.",
        example: "Sample date",
        required: true,
    })
    date: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid type.",
        example: "Sample type",
        required: true,
    })
    type: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid from.",
        example: "Sample from",
        required: true,
    })
    from: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid to.",
        example: "Sample to",
        required: true,
    })
    to: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid status.",
        example: "Sample status",
        required: true,
    })
    status: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SessionRecordDto)
    @ApiProperty({
        description: "Provide a valid sessionRecords.",
        example: ['sessionRecords_1', 'sessionRecords_2'],
        required: true,
    })
    sessionRecords: SessionRecordDto[];
}
