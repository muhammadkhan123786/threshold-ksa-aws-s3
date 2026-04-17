import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, IsEnum } from "class-validator";
import { Bank } from "src/enums/bank.enum";

export class UpdateBankDetailsDto {
    @ApiProperty({
        description: "The name of the account holder.",
        example: "John Doe",
        required: false,
    })
    @IsOptional()
    @IsString()
    accountHolder?: string;

    @ApiProperty({
        description: "The bank account IBAN.",
        example: "SA1234567890123456789012",
        required: false,
    })
    @IsOptional()
    iban?: string;

    @ApiProperty({
        description: "The bank name selected from a predefined list.",
        enum: Bank,
        example: Bank.ALJAZIRA,
        required: false,
    })
    @IsOptional()
    @IsEnum(Bank, {
        message: `Bank must be one of: ${Object.values(Bank).join(", ")}`,
    })
    bank?: Bank;
}
