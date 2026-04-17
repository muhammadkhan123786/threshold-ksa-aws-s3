import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { SessionRecord } from "./sessionRecord.entity";
import { PerformanceStyle } from "src/enums/teams.enum";

@Entity()
export class PerformanceRecord {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(
        () => SessionRecord,
        (sessionRecord) => sessionRecord.performanceRecords
    )
    sessionRecord: SessionRecord;

    @Column({ nullable: false })
    distance: number;

    @Column({
        type: "enum",
        enum: PerformanceStyle,
        nullable: false,
    })
    style: PerformanceStyle;

    @Column({
        nullable: true,
        type: "float",
    })
    time: number;

    @Column({
        nullable: true,
        type: "text",
    })
    notes?: string;
}
