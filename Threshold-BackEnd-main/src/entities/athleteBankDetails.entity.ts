import { IsString, IsUUID } from "class-validator";
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Athlete } from "./athlete.entity";
import { Bank } from "src/enums/bank.enum";
import { Coach } from "./coach.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { Manager } from "./manager.entity";

@Entity()
export class AthleteBankDetails {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ nullable: false })
    @IsString()
    iban: string;

    @Column({ type: "enum", enum: Bank, nullable: false })
    bank: Bank;

    @Column({ nullable: false })
    @IsString()
    accountHolder: string;

    @OneToOne(() => Athlete, (athlete) => athlete.bankDetails)
    athlete: Athlete;

    @OneToOne(() => Coach, (coach) => coach.bankDetails)
    coach: Coach;

    @OneToOne(() => ClubAdmin, (admin) => admin.bankDetails)
    clubAdmin: ClubAdmin;

    @OneToOne(() => Manager, (manager) => manager.bankDetails)
    manager: Manager;
}
