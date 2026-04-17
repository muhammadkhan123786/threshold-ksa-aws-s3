import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import { IsString, IsDate } from "class-validator";
import { Coach } from "./coach.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { Manager } from "./manager.entity";

@Entity("medical_history")
export class MedicalHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "date" })
    @IsDate()
    date: Date;

    @Column()
    @IsString()
    type: string;

    @Column({ type: "text" })
    @IsString()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => Coach, (coach) => coach.medicalHistory, {
        onDelete: "CASCADE",
    })
    coach: Coach;

    @ManyToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.medicalHistory)
    clubAdmin: ClubAdmin;

    @ManyToOne(() => Manager, (manager) => manager.medicalHistory)
    manager: Manager;
}
