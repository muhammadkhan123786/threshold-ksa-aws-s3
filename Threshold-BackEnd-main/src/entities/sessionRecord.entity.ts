import { Athlete } from "./athlete.entity";
import { Session } from "./session.entity";
import { IsInt, Max, Min } from "class-validator";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { IsUUID } from "class-validator";
import { SessionRecordStatus } from "src/enums/athletes.enum";
import { PerformanceRecord } from "./performanceRecord.entity";

@Entity()
export class SessionRecord {
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
        default: SessionRecordStatus.PRESENT,
    })
    status: SessionRecordStatus;

    @Column({
        nullable: true,
    })
    comment?: string;

    @IsInt()
    @Min(0)
    @Max(10)
    @Column({
        nullable: true,
    })
    scale?: number;

    // --- relations ---
    @ManyToOne(() => Athlete, (athlete) => athlete.sessionRecords)
    athlete: Athlete;

    @ManyToOne(() => Session, (session) => session.sessionRecords)
    session: Session;

    @OneToMany(
        () => PerformanceRecord,
        (performanceRecord) => performanceRecord.sessionRecord
    )
    performanceRecords: PerformanceRecord[];
}
