import { Athlete } from "./athlete.entity";
import { IsDate, IsInt } from "class-validator";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";
import { IsUUID } from "class-validator";

@Entity()
export class AthleteBattery {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    // --- columns ---
    @IsInt()
    @Column({
        nullable: false,
    })
    pacer: string;

    @IsInt()
    @Column({
        nullable: false,
    })
    sit: string;

    @IsInt()
    @Column({
        nullable: false,
    })
    trunk: string;

    @IsInt()
    @Column({
        nullable: false,
    })
    push: string;

    @IsInt()
    @Column({
        nullable: false,
    })
    curl: string;

    @IsDate()
    @Column({
        nullable: false,
    })
    date: string;

    // --- relations ---
    @ManyToOne(() => Athlete, (athlete) => athlete.athleteBatteries)
    athlete: Athlete;
}
