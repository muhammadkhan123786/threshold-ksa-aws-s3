import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    ManyToMany,
} from "typeorm";
import { IsEmail, IsEnum, IsUUID, Length, Matches } from "class-validator";
import { Academy } from "./academy.entity";
import { Language, UserRole } from "src/enums/users.enum";
import { Notification } from "./notification.entity";

import { ApprovalLog } from "./ApprovalLog.entity";
import { Coach } from "./coach.entity";
import { ResetToken } from "./resetToken.entity";
import { Branch } from "./branch.entity";
import { ClubAdmin } from "./clubAdmin.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    // --- columns ---

    @Column({
        nullable: false,
        unique: true,
    })
    username: string;

    @IsEmail()
    @Column({
        unique: true,
        nullable: false,
    })
    email: string;

    @Length(8, 25)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    @Column({
        nullable: false,
    })
    password: string;

    @Column({
        nullable: true,
    })
    phoneNumber?: string;

    @IsEnum(UserRole)
    @Column({
        type: "enum",
        enum: UserRole,
        nullable: true,
        default: UserRole.MEMBER,
    })
    role: UserRole | string;

    @IsEnum(Language)
    @Column({
        type: "enum",
        enum: Language,
        nullable: true,
        default: Language.ENGLISH,
    })
    language?: Language;

    @Column({
        nullable: true,
        default: "",
    })
    avatar: string;

    @Column({
        nullable: true,
        default: false,
    })
    notification?: boolean;

    @Column({
        nullable: true,
        default: "",
    })
    token?: string;

    // --- relations ---
    @ManyToOne(() => Academy, (academy) => academy.users)
    academy?: Academy;

    @Column({
        nullable: false,
        default: true,
    })
    isApproved: boolean;

    @OneToMany(() => ApprovalLog, (approvalLog) => approvalLog.performedBy)
    performedApprovalLogs: ApprovalLog[];

    @OneToOne(() => Coach, (coach) => coach.user)
    coach: Coach;

    @ManyToOne(() => Branch, (branch) => branch.users, { onDelete: "SET NULL" })
    branch?: Branch;

    @OneToMany(() => ResetToken, (resetToken) => resetToken.user)
    resetTokens: ResetToken[];

    @ManyToMany(() => Notification, (notification) => notification)
    seenNotifications: Notification[];

    @OneToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.user)
    clubAdmin?: ClubAdmin;
}
