import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { Athlete } from "./athlete.entity";

@Entity()
export class AthleteHealthRecords {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Athlete, (athlete) => athlete.healthRecords)
    athlete: Athlete;

    @Column()
    type: string;

    @Column()
    description: string;

    @Column({ type: "date" })
    startDate: string;

    @Column({ type: "date", nullable: true })
    endDate?: string;

    @Column()
    medicalRecommendation: string;

    @CreateDateColumn()
    dateOfUpdating: Date;
}
