import { IsEnum, IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { SubscriptionStatus } from "src/enums/subscription-status.enum";
import { SubscriptionPeriod } from "src/enums/subscription-period.enum";
import { PaymentMethod } from "src/enums/payment-method.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAthleteSubscriptionDto {
    @IsEnum(SubscriptionStatus)
    @ApiProperty({
        description: "Provide a valid status.",
        example: "Sample status",
        required: true,
    })
    status: SubscriptionStatus;

    @IsEnum(SubscriptionPeriod)
    @ApiProperty({
        description: "Provide a valid period.",
        example: "Sample period",
        required: true,
    })
    period: SubscriptionPeriod;

    @IsDate()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid subscriptionDate.",
        example: "2023-01-01",
        required: true,
    })
    subscriptionDate: Date;

    @IsEnum(PaymentMethod)
    @ApiProperty({
        description: "Provide a valid paymentMethod.",
        example: "Sample paymentMethod",
        required: true,
    })
    paymentMethod: PaymentMethod;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid cashValue.",
        example: "123",
        required: true,
    })
    cashValue: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: "Provide a valid remainingValue.",
        example: "123",
        required: true,
    })
    remainingValue: number;
}
