import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { Bank } from "src/enums/bank.enum";

export class UpdateBankDetailsDto {
    @ApiProperty({ example: "John Doe", description: "Account holder's name" })
    @IsOptional()
    @IsString()
    accountHolder?: string;

    @ApiProperty({ example: "SA1234567890123456789012", description: "IBAN number" })
    @IsOptional()
    @IsString()
    iban?: string;

    @ApiProperty({
        example: Bank.ALBILAD,
        description: "Bank name",
        enum: Bank,
    })
    @IsOptional()
    @IsString()
    bank?: Bank;
}
