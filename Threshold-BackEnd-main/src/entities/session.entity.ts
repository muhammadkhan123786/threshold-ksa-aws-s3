import { SessionRecord } from "./sessionRecord.entity";
import { Academy } from "./academy.entity";
import { Team } from "./team.entity";
import { IsDate } from "class-validator";
import {
    Entity,
    OneToMany,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { IsUUID } from "class-validator";
import {
    PlayingSessionType,
    PlayingSessionStatus,
} from "src/enums/athletes.enum";
import { PlanningSession } from "./planningSession.entity";
import { WeeklySession } from "./weeklySession.entity";
import { TeamSession } from "./teamSession.entity";

@Entity()
export class Session {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({
        nullable: true,
    })
    title?: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    // --- columns ---

    @Column({
        nullable: false,
        default: PlayingSessionStatus.NOT_STARTED,
    })
    status: PlayingSessionStatus;

    @Column({
        nullable: false,
    })
    from?: string;

    @Column({
        nullable: false,
    })
    to?: string;

    @Column({
        nullable: false,
    })
    type: PlayingSessionType;

    @IsDate()
    @Column({
        nullable: false,
    })
    date: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    achievedSession: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    space: string;

    // --- relations ---
    @OneToMany(() => SessionRecord, (sessionRecord) => sessionRecord.session)
    sessionRecords: SessionRecord[];

    @ManyToOne(() => WeeklySession, (weeklySession) => weeklySession.sessions, {
        nullable: true,
    })
    weeklySession?: WeeklySession;

    @ManyToOne(() => Academy, (academy) => academy.sessions)
    academy: Academy;

    @ManyToOne(() => Team, (team) => team.sessions)
    team: Team;

    @OneToMany(
        () => PlanningSession,
        (planningSession) => planningSession.session
    )
    planningSessions: PlanningSession[];

    @OneToOne(() => TeamSession, (teamSession) => teamSession.nextSession, {
        nullable: true,
    })
    @JoinColumn()
    teamSession?: TeamSession;
}
