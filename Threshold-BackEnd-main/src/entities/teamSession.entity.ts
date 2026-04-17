import { Team } from "./team.entity";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { IsUUID } from "class-validator";

import { Session } from "./session.entity";
@Entity()
export class TeamSession {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @ManyToOne(() => Team, (team) => team.id)
    team: Team;

    @OneToOne(() => Session)
    @JoinColumn()
    nextSession: Session;

    @Column({ nullable: true })
    nextSessionKPI?: string;

    @Column({ nullable: true })
    nextSessionStartTime?: string;

    @Column({ nullable: true })
    nextSessionEndTime?: string;

    @Column({ nullable: true })
    sessionType?: string;
}
