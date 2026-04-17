import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
} from "typeorm";
import { IsUUID, IsString, IsEnum } from "class-validator";
import { Athlete } from "./athlete.entity";
import { Relationship } from "src/enums/athletes.enum";

@Entity()
export class EmergencyContact {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @IsString()
    @Column()
    name: string;

    @IsString()
    @Column()
    phoneNumber: string;

    @IsString()
    @Column()
    nationalNumber: string;

    @IsString()
    @Column({ nullable: true })
    relationship?: string;

    @OneToOne(() => Athlete, (athlete) => athlete.emergencyContact)
    athlete: Athlete;
}
