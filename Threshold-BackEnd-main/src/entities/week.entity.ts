import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsUUID, IsString, IsDate, IsInt, Min, Max, IsOptional } from "class-validator";
import { SubGoal } from "./subGoal.entity";

@Entity()
export class Week {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column()
    @IsString()
    title: string;

    @Column({ type: "int", nullable: true })
    @IsInt()
    @Min(1)
    @Max(4)
    weekNumber: number;

    @Column({ type: "date" })
    @IsDate()
    startDate: Date;

    @Column({ type: "date" })
    @IsDate()
    endDate: Date;

    @Column({ type: "varchar", length: 50, nullable: true })
    @IsString()
    volumeTargeted: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    @IsString()
    @IsOptional()
    volumeUnit: string;

    @Column({ type: "int", nullable: true })
    @IsInt()
    totalSessions: number;

    @Column({ type: "int", nullable: true })
    @IsInt()
    neededSessions: number;

    @ManyToOne(() => SubGoal, (subGoal) => subGoal.weeks)
    subGoal: SubGoal;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
