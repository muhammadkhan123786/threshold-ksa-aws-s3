import { SportProfile } from "./sportProfile.entity";
import { Feedback } from "./feedback.entity";
import { Session } from "./session.entity";
import { Team } from "./team.entity";
import { Coach } from "./coach.entity";
import { AthleteProfile } from "./athleteProfile.entity";
import { Athlete } from "./athlete.entity";
import { User } from "./user.entity";
import {
    Entity,
    OneToMany,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";
import { IsBoolean, IsString, IsUUID } from "class-validator";
import { Branch } from "./branch.entity";
import { WeeklySession } from "./weeklySession.entity";
import { AcademyType } from "src/enums/appType.enum";
import { Manager } from "./manager.entity";
import { ClubAdmin } from "./clubAdmin.entity";

@Entity()
export class Academy {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ nullable: true })
    @IsString()
    avatarUrl?: string;

    @Column({ nullable: true })
    @IsString()
    address?: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column({
        nullable: true,
    })
    contactNumber?: string;

    @Column({
        nullable: false,
    })
    registrationNumber: string;

    @Column({
        nullable: false,
    })
    name: string;

    @Column({
        nullable: false,
        default: false,
    })
    @IsBoolean()
    isMultiBranch: boolean;

    @Column({ type: "enum", enum: AcademyType, default: AcademyType.ACADEMY })
    type: AcademyType;

    @OneToMany(() => SportProfile, (sportProfile) => sportProfile.academy)
    sportProfiles: SportProfile[];

    @OneToMany(() => SportProfile, (sportProfile) => sportProfile.academy)
    sportClubProfiles: SportProfile[];

    @OneToMany(() => Feedback, (feedback) => feedback.academy)
    feedbacks: Feedback[];

    @Column("text", { array: true, nullable: true })
    phoneNumbers: string[];

    @OneToMany(() => Session, (session) => session.academy)
    sessions: Session[];

    @OneToMany(() => WeeklySession, (weeklySession) => weeklySession.academy)
    weeklySession: WeeklySession[];

    @OneToMany(() => Team, (team) => team.academy)
    teams: Team[];

    @OneToMany(() => Coach, (coach) => coach.academy)
    coaches: Coach[];

    @OneToMany(() => AthleteProfile, (athleteProfile) => athleteProfile.academy)
    athleteProfiles: AthleteProfile[];

    @OneToMany(() => Athlete, (athlete) => athlete.academy)
    athletes: Athlete[];

    @OneToMany(() => User, (user) => user.academy)
    users: User[];

    @OneToMany(() => Branch, (branch) => branch.academy)
    branches: Branch[];

    @OneToMany(() => Manager, (manager) => manager.academy)
    managers: Manager[];

    @OneToMany(() => ClubAdmin, (clubAdmin) => clubAdmin.academy, {
        cascade: true,
    })
    clubAdmins: ClubAdmin[];
}
