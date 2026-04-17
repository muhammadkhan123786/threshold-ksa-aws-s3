import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsUUID, IsString, IsDate, IsInt } from "class-validator";
import { SubGoal } from "./subGoal.entity";
import { Team } from "./team.entity";

@Entity()
export class TeamGoal {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column()
    @IsString()
    title: string;

    @Column({ type: "text", nullable: true })
    @IsString()
    description?: string;

    @Column({ type: "int" })
    @IsInt()
    year: number;

    @Column({ type: "date" })
    @IsDate()
    startDate: Date;

    @Column({ type: "date" })
    @IsDate()
    endDate: Date;

    @ManyToOne(() => Team, (team) => team.goals)
    team: Team;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
