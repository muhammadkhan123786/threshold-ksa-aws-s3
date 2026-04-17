import { Academy } from "./academy.entity";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { IsString, IsUUID } from "class-validator";
import { SportProfileType } from "src/enums/athletes.enum";
import { Branch } from "./branch.entity";
import { ClubAdmin } from "./clubAdmin.entity";

@Entity()
export class SportProfile {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    // --- columns ---

    @Column({
        nullable: false,
        enum: SportProfileType,
    })
    sport: SportProfileType;

    @Column({
        nullable: false,
        default: "",
    })
    hand: string;

    @Column({
        nullable: false,
        default: "",
    })
    foot: string;

    @Column({
        nullable: false,
        default: "",
    })
    position: string;

    // --- relations ---
    @ManyToOne(() => Academy, (academy) => academy.sportProfiles)
    academy: Academy;

    @OneToMany(() => Branch, (branch) => branch.sportProfiles, {
        nullable: false,
    })
    branch: Branch;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;
}
