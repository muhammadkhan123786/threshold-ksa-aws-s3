import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Athlete } from "./athlete.entity";
import { SubscriptionStatus } from "src/enums/subscription-status.enum";
import { SubscriptionPeriod } from "src/enums/subscription-period.enum";
import { PaymentMethod } from "src/enums/payment-method.enum";

@Entity()
export class AthleteSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: SubscriptionStatus,
        default: SubscriptionStatus.ACTIVE,
    })
    status: SubscriptionStatus;

    @Column({
        type: "enum",
        enum: SubscriptionPeriod,
        nullable: true,
    })
    period: SubscriptionPeriod;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    subscriptionDate: Date;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    expiryDate: Date;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        default: 0,
    })
    price: number;

    @Column({
        type: "enum",
        enum: PaymentMethod,
        default: PaymentMethod.CASH,
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        default: 0,
    })
    cashValue: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        default: 0,
    })
    remainingValue: number;

    @Column({
        type: "int",
        default: 0,
    })
    remainingDays: number;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updated_at: Date;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    lastChecked: Date;

    @OneToOne(() => Athlete, (athlete) => athlete.subscription)
    @JoinColumn()
    athlete: Athlete;

    isExpired(): boolean {
        return this.expiryDate ? this.expiryDate < new Date() : false;
    }
    calculateExpiryDate(): Date {
        const date = new Date(this.subscriptionDate);

        switch (this.period) {
            case SubscriptionPeriod.FIFTEEN_DAYS:
                date.setDate(date.getDate() + 15);
                break;
            case SubscriptionPeriod.ONE_MONTH:
                date.setMonth(date.getMonth() + 1);
                break;
            case SubscriptionPeriod.TWO_MONTHS:
                date.setMonth(date.getMonth() + 2);
                break;
            case SubscriptionPeriod.THREE_MONTHS:
                date.setMonth(date.getMonth() + 3);
                break;
            case SubscriptionPeriod.SIX_MONTHS:
                date.setMonth(date.getMonth() + 6);
                break;
            case SubscriptionPeriod.ONE_YEAR:
                date.setFullYear(date.getFullYear() + 1);
                break;
            case SubscriptionPeriod.TWO_YEARS:
                date.setFullYear(date.getFullYear() + 2);
                break;
            case SubscriptionPeriod.THREE_YEARS:
                date.setFullYear(date.getFullYear() + 3);
                break;
            default:
                throw new Error("Invalid subscription period");
        }

        return date;
    }

    calculateRemainingDays(): number {
        if (this.expiryDate) {
            const today = new Date();
            const remainingTime = this.expiryDate.getTime() - today.getTime();
            return Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        }
        return 0;
    }

    preserveRemainingDays(): void {
        if (this.expiryDate) {
            this.remainingDays = this.calculateRemainingDays();
        }
    }
}
