import { Academy } from "./academy.entity";
import { IsEmail, IsOptional, IsUUID } from "class-validator";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

export enum FeedbackType {
    ISSUE = "issue",
    REQUEST = "request",
    SUGGESTION = "suggestion",
    OTHER = "other",
}

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    // --- columns ---

    @Column({
        nullable: true,
        type: "text",
    })
    @IsOptional()
    notes?: string;

    @IsEmail()
    @IsOptional()
    @Column({
        nullable: true,
        type: "varchar",
    })
    email?: string;

    @IsOptional()
    @Column({
        nullable: true,
        type: "varchar",
    })
    name?: string;

    @IsOptional()
    @Column({
        nullable: true,
        type: "varchar",
    })
    avatar?: string;

    @Column({
        type: "enum",
        enum: FeedbackType,
        default: FeedbackType.OTHER,
    })
    type: FeedbackType;

    @IsOptional()
    @Column({
        nullable: true,
        type: "varchar",
    })
    subject?: string;

    // --- relations ---
    @ManyToOne(() => Academy, (academy) => academy.feedbacks, {
        nullable: true,
    })
    @IsOptional()
    academy?: Academy;
}
