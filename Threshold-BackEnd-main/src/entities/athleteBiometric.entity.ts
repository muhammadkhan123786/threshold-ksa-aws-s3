import { IsDate, IsDecimal } from "class-validator";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { IsUUID } from "class-validator";
import { AthleteBiometricStatus } from "src/enums/athletes.enum";
import { Athlete } from "./athlete.entity";

@Entity()
export class AthleteBiometric {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    // --- columns ---
    @IsDate()
    @Column({
        nullable: false,
    })
    date: string;

    @Column({
        type: "enum",
        enum: AthleteBiometricStatus,
        default: AthleteBiometricStatus.HEALTHY,
    })
    status: AthleteBiometricStatus;

    @IsDecimal()
    @Column({
        nullable: false,
    })
    bmi: string;

    @IsDecimal()
    @Column({
        nullable: false,
    })
    bmiPercentile: string;

    @IsDecimal()
    @Column({
        nullable: false,
    })
    weight: string;

    @IsDecimal()
    @Column({
        nullable: false,
    })
    height: string;

    // --- relations ---
    @ManyToOne(() => Athlete, (athlete) => athlete.athleteBiometrics)
    athlete: Athlete;
}
