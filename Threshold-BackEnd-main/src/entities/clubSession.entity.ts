import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsUUID, IsDate } from "class-validator";
import { Team } from "./team.entity";
import { ClubSessionTemplate } from "./clubSessionTemplate.entity";

export enum ClubSessionStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FINISHED = "finished",
    CANCELLED = "cancelled",
}

@Entity("club_session")
export class ClubSession {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column()
    title: string;

    @ManyToOne(() => Team, (team) => team.clubSessions)
    team: Team;

    @Column()
    teamId: string;

    @ManyToOne(() => ClubSessionTemplate, (template) => template.sessions, {
        onDelete: "CASCADE",
    })
    template: ClubSessionTemplate;

    @Column()
    templateId: string;

    @Column({
        type: "enum",
        enum: ClubSessionStatus,
        default: ClubSessionStatus.NOT_STARTED,
    })
    status: ClubSessionStatus;

    @Column({ nullable: true })
    missionAssociated: string;

    @Column({ type: "float", nullable: true })
    volumeTargeted: number;

    @Column({ type: "timestamp" })
    @IsDate()
    startTime: Date;

    @Column({ type: "timestamp" })
    @IsDate()
    endTime: Date;

    @Column("simple-array", {
        name: "spaces",
        nullable: true,
        transformer: {
            to: (value: string[] | null) => {
                if (!value || !Array.isArray(value)) return null;
                return value.length > 0 ? value : null;
            },
            from: (value: string[] | null) => {
                if (!value) return [];
                return Array.isArray(value) ? value : [];
            },
        },
        default: []
    })
    spaces: string[];

    @Column({ type: "float", nullable: true })
    averagePE: number;

    @Column("jsonb", { nullable: true })
    phaseResults: {
        phaseId: string;
        phaseName: string;
        techniques: {
            name: string;
            value: string;
            unit: string;
            results: {
                playerId: string;
                value: number;
            }[];
        }[];
        athleteRecords: {
            athleteId: string;
            athleteName: string;
            measurements: Record<string, number>;
        }[];
    }[];

    @Column({ type: "simple-array", nullable: true })
    invitedPositions: string[];

    @Column({ type: "text", nullable: true })
    notes: string;

    @Column("jsonb", { nullable: true })
    playerRevision?: Array<{
        playerId: string;
        playerName: string;
        record: {
            rpe: number;
            note: string | null;
            submittedAt: Date;
            level: string;
        };
    }>;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
