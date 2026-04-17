import {
    Entity,
    Column,
    PrimaryColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
    OneToMany,
    OneToOne,
    JoinColumn,
    Generated,
    BeforeInsert,
} from "typeorm";
import { IsUUID, IsString, IsDate } from "class-validator";
import { Academy } from "./academy.entity";
import { Branch } from "./branch.entity";
import { Athlete } from "./athlete.entity";
import { Coach } from "./coach.entity";
import { ClubAdmin } from "./clubAdmin.entity";
import { sportClubProfiles } from "./sportClubProfiles.entity";
import { Gender } from "src/enums/team-category.enum";
import { TeamCategory } from "src/enums/team.enum";
import { WeeklySession } from "./weeklySession.entity";
import { TeamSession } from "./teamSession.entity";
import { Session } from "./session.entity";
import { SportProfileType } from "src/enums/athletes.enum";
import { TeamGoal } from "./teamGoal.entity";
import { SubGoal } from "./subGoal.entity";
import { ClubSession } from "./clubSession.entity";
import { generatePrefixedId } from "src/utils/id-generator";

@Entity()
export class Team {
    @PrimaryColumn({ type: "varchar" })
    id: string;

    @BeforeInsert()
    generateId() {
        this.id = generatePrefixedId('TEM');
    }

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column({ nullable: false })
    @IsString()
    name: string;

    @Column({ nullable: true })
    @IsString()
    avatarUrl?: string;

    @Column({ nullable: true })
    @IsString()
    avatarPath?: string;

    @Column({ nullable: true })
    @IsString()
    background?: string;

    @IsDate()
    @Column({
        nullable: true,
        type: "timestamp",
    })
    creationDate: Date;

    @Column({
        nullable: true,
        type: "enum",
        enum: SportProfileType,
    })
    sport: string;

    @Column({ nullable: true })
    @IsString()
    category?: string;

    @Column({ nullable: true, default: "" })
    logo: string;

    @Column({ type: "json", nullable: true })
    spaces: string[];

    @Column({ nullable: true })
    @IsString()
    gender?: string;

    // --- Relations ---
    @ManyToOne(() => Branch, (branch) => branch.teams)
    branch: Branch;

    @ManyToOne(() => Academy, (academy) => academy.teams)
    academy: Academy;

    @ManyToMany(() => Athlete, (athlete) => athlete.teams)
    athletes: Athlete[];

    @OneToMany(() => Session, (session) => session.team)
    sessions: Session[];

    @OneToOne(() => TeamSession, (teamSession) => teamSession.team, {
        nullable: true,
    })
    @JoinColumn()
    teamSession?: TeamSession;

    @OneToMany(() => WeeklySession, (weeklySession) => weeklySession.team)
    weeklySessions: WeeklySession[];

    @ManyToOne(() => sportClubProfiles, (sportProfile) => sportProfile.teams, {
        nullable: true,
    })
    sportProfile: sportClubProfiles;

    @ManyToMany(() => Coach, (coach) => coach.subTeams)
    subCoaches: Coach[];

    @ManyToOne(() => Coach, (coach) => coach.teams)
    coach: Coach;

    @ManyToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.teams, {
        nullable: true,
    })
    clubAdmin: ClubAdmin;

    @OneToMany(() => TeamGoal, (teamGoal) => teamGoal.team)
    goals: TeamGoal[];

    @OneToMany(() => SubGoal, (subGoal) => subGoal.team)
    subGoals: SubGoal[];

    @OneToMany(() => ClubSession, (session) => session.team)
    clubSessions: ClubSession[];
}
