import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import {
    IsUUID,
    IsString,
    IsDate,
    IsOptional,
    IsEnum,
} from "class-validator";
import { Coach } from "./coach.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { Manager } from "./manager.entity";

export enum WorkType {
    FULL_TIME = "Full-Time",
    PART_TIME = "Part-Time",
    CONTRACT = "Contract",
    INTERNSHIP = "Internship",
    VOLUNTEER = "Volunteer",
}

@Entity("work_history")
export class WorkHistory {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column()
    @IsString()
    companyName: string;

    @Column()
    @IsString()
    position: string;

    @Column({ type: "text", nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Column({ type: "date" })
    @IsDate()
    startDate: Date;

    @Column({ type: "date", nullable: true })
    @IsDate()
    @IsOptional()
    endDate?: Date;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    location?: string;

    @Column({ type: "enum", enum: WorkType, default: WorkType.FULL_TIME })
    @IsEnum(WorkType)
    workType: WorkType;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    responsibilities?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    achievements?: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    // Relations
    @ManyToOne(() => Coach, (coach) => coach.workHistory, {
        onDelete: "CASCADE",
    })
    coach: Coach;

    @ManyToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.workHistory)
    clubAdmin: ClubAdmin;

    @ManyToOne(() => Manager, (manager) => manager.workHistory)
    manager: Manager;
} 