import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
    BeforeUpdate,
    OneToOne,
    OneToMany,
} from "typeorm";
import {
    IsUUID,
    IsEnum,
    IsDateString,
    IsDate,
    IsOptional,
    IsString,
} from "class-validator";
import { Manager } from "./manager.entity";
import { Coach } from "./coach.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { Athlete } from "./athlete.entity";
import { ContractAudit } from "./contractAudit.entity";

export enum ContractType {
    PERMANENT = "Permanent",
    TEMPORARY = "Temporary",
    FULL_TIME = "Full-Time",
    PART_TIME = "Part-Time",
    SEASONAL = "Seasonal",
    APPRENTICESHIP = "Apprenticeship",
    FLEXIBLE = "Flexible",
    CONSULTANCY = "Consultancy",
}

export enum ContractStatus {
    ACTIVE = "Active",
    EXPIRED = "Expired",
    TERMINATED = "Terminated",
}

export enum ContractDuration {
    THREE_MONTHS = "3_months",
    SIX_MONTHS = "6_months",
    ONE_YEAR = "1_year",
    TWO_YEARS = "2_years",
    THREE_YEARS = "3_years",

    UNLIMITED = "Unlimited",
}

@Entity("contracts")
export class Contract {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @Column({ type: "enum", enum: ContractType })
    @IsEnum(ContractType)
    type: ContractType;

    @Column({ type: "date" })
    @IsDateString()
    joinDate: Date;

    @Column({ type: "date", nullable: true })
    @IsDate()
    expirationDate?: Date;

    @Column({
        type: "enum",
        enum: ContractDuration,
        default: ContractDuration.ONE_YEAR,
    })
    @IsEnum(ContractDuration)
    contractDuration: ContractDuration;

    @Column({ type: "varchar", nullable: true })
    @IsOptional()
    @IsString()
    contractUrl?: string;

    @Column({
        type: "enum",
        enum: ContractStatus,
        default: ContractStatus.ACTIVE,
    })
    @IsEnum(ContractStatus)
    status: ContractStatus;

    @OneToOne(() => Manager, (manager) => manager.contract, { nullable: true })
    manager?: Manager;

    @OneToOne(() => Coach, (coach) => coach.contract, { nullable: true })
    coach: Coach;

    @OneToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.contract, {
        nullable: true,
    })
    clubAdmin: ClubAdmin;

    @OneToOne(() => Athlete, (athlete) => athlete.contract, { nullable: true })
    player: Athlete;

    @OneToMany(() => ContractAudit, (audit) => audit.contract)
    audits: ContractAudit[];

    @BeforeInsert()
    @BeforeUpdate()
    calculateExpirationDate() {
        if (!this.joinDate) {
            throw new Error("Contract must have a valid start date.");
        }

        const start = new Date(this.joinDate);
        let expirationDate: Date | null = new Date(start);

        switch (this.contractDuration) {
            case ContractDuration.THREE_MONTHS:
                expirationDate.setMonth(expirationDate.getMonth() + 3);
                break;
            case ContractDuration.SIX_MONTHS:
                expirationDate.setMonth(expirationDate.getMonth() + 6);
                break;
            case ContractDuration.ONE_YEAR:
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                break;
            case ContractDuration.TWO_YEARS:
                expirationDate.setFullYear(expirationDate.getFullYear() + 2);
                break;
            case ContractDuration.THREE_YEARS:
                expirationDate.setFullYear(expirationDate.getFullYear() + 3);
                break;
            case ContractDuration.UNLIMITED:
                expirationDate = null;
                break;
            default:
                throw new Error("Invalid contract duration.");
        }

        this.expirationDate = expirationDate;
    }
}





