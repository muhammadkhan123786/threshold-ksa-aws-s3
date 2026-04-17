import { Transform, Type } from "class-transformer";
import {
    IsEnum,
    Matches,
    IsArray,
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional,
    IsDate,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    Relationship,
    Nationality,
    Education,
    Gender,
    YesNo,
    Consideration,
} from "src/enums/athletes.enum";
import { SubscriptionPeriod } from "src/enums/subscription-period.enum";
import { PaymentMethod } from "src/enums/payment-method.enum";

export class CreateAthleteDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ 
        required: false,
        description: "Relationship to the athlete",
        example: "Father" 
    })
    relationship?: string;

    @ApiProperty({
        description: "Phone number of the athlete.",
        example: "0512345678",
        required: true,
    })
    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, description: "Nationality of the athlete" })
    nationality?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: "The education level of the athlete.",
        example: "test",
    })
    education?: string;

    @IsEnum(Gender)
    @ApiProperty({ enum: Gender, required: true })
    gender: Gender;

    @IsEnum(YesNo)
    @ApiProperty({ enum: YesNo, required: true })
    allergies: YesNo;

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ nullable: true, default: [] })
    chronic: string[];

    @IsEnum(YesNo)
    @ApiProperty({ enum: YesNo, required: true })
    injury: YesNo;

    @IsEnum(Consideration)
    @ApiProperty({ enum: Consideration, required: true })
    consideration: Consideration;

    @Transform(({ value }) => new Date(value))
    @ApiProperty({ required: false, description: "Date of updating" })
    dateOfUpdating: Date;

    @Type(() => Date)
    @ApiProperty({ required: false, description: "Join date" })
    joinDate: Date;

    @Transform(({ value }) => new Date(value))
    @ApiProperty({ required: true, description: "Date of birth" })
    dateOfBirth: Date;

    @ApiProperty({ required: true, description: "National ID Number" })
    nin: string;

    @IsOptional()
    @IsDate()
    @ApiPropertyOptional({
        description:
            "The expiration date of the athlete's national identification number (NIN).",
        example: "2026-01-01T00:00:00Z",
    })
    ninExpirationDate?: Date;

    @ApiProperty({ required: false, description: "Profile image link" })
    avatar?: string;

    @ApiProperty({ required: true, description: "Last name of the athlete" })
    lastName: string;

    @ApiProperty({ required: true, description: "First name of the athlete" })
    firstName: string;

    @ApiProperty({ required: false, description: "Branch of the academy" })
    branch?: string;

    @ApiProperty({ required: true, description: "Related academy ID" })
    academy: string;

    @IsEnum(SubscriptionPeriod)
    @ApiProperty({ enum: SubscriptionPeriod, required: true })
    periodOfSubscription: SubscriptionPeriod;

    @IsEnum(PaymentMethod)
    @ApiProperty({ enum: PaymentMethod, required: true })
    paymentMethod: PaymentMethod;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, description: "Cash value" })
    cashValue: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, description: "Remaining value" })
    remainingValue: number;
}
