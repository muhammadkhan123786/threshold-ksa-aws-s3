import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";
import {
    IsUUID,
    IsString,
    IsInt,
    Min,
    Max,
    IsDate,
    IsOptional,
} from "class-validator";
import { Team } from "./team.entity";
import { Week } from "./week.entity";

@Entity()
export class SubGoal {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    title: string;

    @Column({ type: "int", nullable: true })
    @IsInt()
    @Min(1)
    @Max(12)
    @Index()
    @IsOptional()
    monthNumber: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    @IsString()
    @IsOptional()
    volumeTargeted: string;

    @Column({ type: "date", nullable: true })
    @IsDate()
    @IsOptional()
    startDate: Date;

    @Column({ type: "date", nullable: true })
    @IsDate()
    @IsOptional()
    endDate: Date;

    @ManyToOne(() => Team, (team) => team.subGoals)
    team: Team;

    @OneToMany(() => Week, (week) => week.subGoal, {
        cascade: ["insert", "update"],
    })
    weeks: Week[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
