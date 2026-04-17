import { Academy } from "./academy.entity";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Unique,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
    JoinTable,
    ManyToMany,
} from "typeorm";
import { IsString, IsUUID } from "class-validator";
import { SportProfileType } from "src/enums/athletes.enum";
import { Coach } from "./coach.entity";
import { Athlete } from "./athlete.entity";
import { Team } from "./team.entity";
import { SportCategory } from "./stocksCategory.entity";
import { Manager } from "./manager.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { ClubSessionTemplate } from "./clubSessionTemplate.entity";

@Entity()
@Unique(["academy", "sport"])
export class sportClubProfiles {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({
        nullable: true,
        default: "",
    })
    @IsString()
    avatarUrl: string;

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

    @Column({
        nullable: false,
        default: true,
    })
    active: boolean;

    // --- relations ---
    @ManyToOne(() => Academy, (academy) => academy.sportClubProfiles)
    academy: Academy;

    @OneToMany(() => Team, (team) => team.sportProfile)
    teams: Team[];

    @OneToMany(() => Coach, (coach) => coach.sportProfile)
    coaches: Coach[];

    @OneToMany(() => Athlete, (athlete) => athlete.sportProfile)
    athletes: Athlete[];

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;

    @OneToMany(() => SportCategory, (category) => category.sportClubProfile, {
        cascade: true,
    })
    categories: SportCategory[];

    @ManyToMany(() => Manager, { nullable: true })
    @JoinTable()
    mainManagers: Manager[];

    @OneToMany(() => ClubAdmin, (clubAdmin) => clubAdmin.sportProfile, {
        cascade: true,
    })
    clubAdmins: ClubAdmin[];

    @OneToMany(() => ClubSessionTemplate, (template) => template.sportProfile)
    sessionTemplates: ClubSessionTemplate[];
}
