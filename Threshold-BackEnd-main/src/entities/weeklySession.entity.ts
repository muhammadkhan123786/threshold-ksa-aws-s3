import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Unique,
} from "typeorm";
import { Session } from "./session.entity";
import { Academy } from "./academy.entity";
import { Team } from "./team.entity";

@Entity()
@Unique(["weekDate", "team"])
export class WeeklySession {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true, type: "text" })
    description: string;

    @Column({ nullable: false })
    weekTarget: number;

    @Column({ type: "date", nullable: false })
    weekDate: string;

    @Column({
        type: "json",
        nullable: true,
    })
    sessionDays: { date: string }[];

    @OneToMany(() => Session, (session) => session.weeklySession)
    sessions: Session[];

    @ManyToOne(() => Academy, (academy) => academy.weeklySession)
    academy: Academy;

    @ManyToOne(() => Team, (team) => team.weeklySessions)
    team: Team;
}
