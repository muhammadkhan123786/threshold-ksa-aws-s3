import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { Bank } from "src/enums/bank.enum";

export class CreateBankDataDto {
    @IsString()
    @ApiProperty({
        description: "Provide a valid IBAN.",
        example: "SA1234567890123456789012",
        required: true,
    })
    iban: string;

    @IsEnum(Bank)
    @ApiProperty({
        description: "Provide a valid bank.",
        example: Bank.ALBILAD,
        required: true,
    })
    bank: Bank;

    @IsString()
    @ApiProperty({
        description: "Provide a valid account holder name.",
        example: "John Doe",
        required: true,
    })
    accountHolder: string;
}
