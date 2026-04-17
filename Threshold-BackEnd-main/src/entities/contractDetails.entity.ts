import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
    BeforeInsert,
    BeforeUpdate,
} from "typeorm";
import {
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
} from "class-validator";
import { Coach } from "./coach.entity";
import { ContractDuration } from "src/enums/contractDuration.enum";
import { ContractStatus } from "src/enums/contractStatus.enum";
import { ClubAdmin } from "./clubAdmin.entity";

@Entity("contract_details")
export class ContractDetails {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ type: "date", nullable: false })
    @IsDate()
    joinDate: Date;

    @Column({
        type: "enum",
        enum: ContractDuration,
        default: ContractDuration.ONE_YEAR,
    })
    @IsEnum(ContractDuration)
    durationPeriod: ContractDuration;

    @Column({
        type: "enum",
        enum: ContractStatus,
        default: ContractStatus.ACTIVE,
    })
    @IsEnum(ContractStatus)
    status: ContractStatus;

    @Column({ type: "text", nullable: true })
    @IsOptional()
    @IsString()
    notes: string;

    @Column({ type: "date", nullable: true })
    @IsDate()
    expirationDate?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToOne(() => Coach, (coach) => coach.contractDetails, {
        nullable: true,
    })
    @JoinColumn()
    coach: Coach;

    @OneToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.contractDetails, {
        nullable: true,
    })
    clubAdmin: ClubAdmin;

    /**
     * Automatically calculates and sets the expiration date
     * based on the joinDate and durationPeriod.
     */
    @BeforeInsert()
    @BeforeUpdate()
    calculateExpirationDate() {
        if (this.joinDate && this.durationPeriod) {
            const joinDate = new Date(this.joinDate);
            switch (this.durationPeriod) {
                case ContractDuration.THREE_MONTHS:
                    joinDate.setMonth(joinDate.getMonth() + 3);
                    break;
                case ContractDuration.SIX_MONTHS:
                    joinDate.setMonth(joinDate.getMonth() + 6);
                    break;
                case ContractDuration.ONE_YEAR:
                    joinDate.setFullYear(joinDate.getFullYear() + 1);
                    break;
                case ContractDuration.TWO_YEARS:
                    joinDate.setFullYear(joinDate.getFullYear() + 2);
                    break;
                case ContractDuration.UNLIMITED:
                    this.expirationDate = null;
                    return;
                default:
                    break;
            }
            this.expirationDate = joinDate;
        }
    }
}
