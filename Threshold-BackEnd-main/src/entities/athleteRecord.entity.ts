import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Athlete } from "./athlete.entity";
import { SportProfileType } from "src/enums/athletes.enum";

@Entity()
export class AthleteRecord {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({
        description: "Unique identifier for the athlete record.",
        example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    })
    id: string;

    @ManyToOne(() => Athlete, (athlete) => athlete.records, {
        onDelete: "CASCADE",
    })
    @ApiProperty({
        description: "The athlete associated with this record.",
        type: () => Athlete,
    })
    athlete: Athlete;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        comment:
            "The subcategory of the sport associated with the athlete's profile.",
    })
    @ApiProperty({
        description:
            "The subcategory of the sport associated with the athlete's profile.",
        example: "Sprint",
        nullable: true,
    })
    subcategory?: string;

    @Column({
        type: "enum",
        enum: SportProfileType,
        nullable: true,
        comment:
            "The category of the sport associated with the athlete's profile. Must be a valid value from the SportProfileType enum.",
    })
    @ApiProperty({
        description:
            "The category of the sport associated with the athlete's profile.",
        example: "RUNNING",
        enum: SportProfileType,
        nullable: true,
    })
    category?: SportProfileType;

    @Column({
        type: "float",
        nullable: true,
        comment: "The athlete's personal best performance in this category.",
    })
    @ApiProperty({
        description:
            "The athlete's personal best performance in this category.",
        example: 130.5,
        nullable: true,
    })
    personalRecord?: number;

    @Column({
        type: "float",
        nullable: true,
        comment:
            "The best performance achieved in this category, either by the athlete or within a specific context.",
    })
    @ApiProperty({
        description:
            "The best performance achieved in this category, either by the athlete or within a specific context.",
        example: 150.0,
        nullable: true,
    })
    bestRecord?: number;

    @Column({
        type: "float",
        nullable: true,
        comment:
            "The most recent performance record of the athlete in this category.",
    })
    @ApiProperty({
        description:
            "The most recent performance record of the athlete in this category.",
        example: 125.3,
        nullable: true,
    })
    lastRecord?: number;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        comment: "The name of the event where the performance was recorded.",
    })
    @ApiProperty({
        description:
            "The name of the event where the performance was recorded.",
        example: "National Championship 2024",
        nullable: true,
    })
    eventName?: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
        comment: "The place where the event took place.",
    })
    @ApiProperty({
        description: "The place where the event took place.",
        example: "Riyadh Stadium",
        nullable: true,
    })
    eventPlace?: string;

    @CreateDateColumn({
        comment: "The date and time when the record was created.",
    })
    @ApiProperty({
        description: "The date and time when the record was created.",
        example: "2024-09-01T12:00:00Z",
    })
    createdAt: Date;

    @UpdateDateColumn({
        comment: "The date and time when the record was last updated.",
    })
    @ApiProperty({
        description: "The date and time when the record was last updated.",
        example: "2024-09-01T12:00:00Z",
    })
    updatedAt: Date;

    @DeleteDateColumn({
        comment: "The date and time when the record was soft deleted.",
    })
    deletedAt?: Date;
}
