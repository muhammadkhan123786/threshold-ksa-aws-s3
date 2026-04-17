import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    OneToOne,
} from "typeorm";
import { IsString, IsOptional, IsArray } from "class-validator";
import { ClubAdmin } from "./clubAdmin.entity";

@Entity("medical_information")
export class MedicalInformation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { array: true, nullable: true })
    @IsArray()
    @IsString({ each: true })
    allergyDetails: string[];

    @Column("text", { array: true, nullable: true })
    @IsArray()
    @IsString({ each: true })
    chronicConditions: string[];

    @Column("text", { array: true, nullable: true })
    @IsArray()
    @IsString({ each: true })
    healthFactors: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToOne(() => ClubAdmin, { cascade: true })
    @JoinColumn()
    clubAdmin: ClubAdmin;
}
