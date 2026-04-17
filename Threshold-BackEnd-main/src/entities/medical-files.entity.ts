import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import { IsString } from "class-validator";
import { Coach } from "./coach.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { Manager } from "./manager.entity";

@Entity("medical_files")
export class MedicalFiles {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    @IsString()
    fileName: string;

    @Column({ nullable: true })
    @IsString()
    description: string;

    @Column()
    @IsString()
    fileUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => Coach, (coach) => coach.medicalFiles, {
        onDelete: "CASCADE",
    })
    coach: Coach;

    @ManyToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.medicalFiles)
    clubAdmin: ClubAdmin;

    @ManyToOne(() => Manager, (manager) => manager.medicalFiles)
    manager: Manager;
}
