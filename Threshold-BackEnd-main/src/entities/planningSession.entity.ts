import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { Session } from "./session.entity";
import { IsUUID, IsString, IsOptional } from "class-validator";

@Entity()
export class PlanningSession {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @Column({
        nullable: true,
    })
    @IsOptional()
    @IsString()
    createdBy?: string;

    @Column({
        nullable: false,
    })
    @IsString()
    title: string;

    @Column({
        nullable: true,
        default: "",
    })
    @IsOptional()
    @IsString()
    description: string;

    @Column({
        nullable: true,
        default: "",
    })
    @IsOptional()
    @IsString()
    theme: string;

    @Column({
        nullable: true,
        default: "",
    })
    @IsOptional()
    @IsString()
    space: string;

    @Column({
        nullable: true,
        default: "",
    })
    @IsOptional()
    @IsString()
    trainingLoad: string;

    @Column({
        nullable: true,
        default: "",
    })
    @IsOptional()
    @IsString()
    timeLoad: string;

    @Column({
        nullable: true,
        default: "",
    })
    @IsOptional()
    @IsString()
    drillImage: string;

    @ManyToOne(() => Session, (session) => session.planningSessions)
    session: Session;
}
