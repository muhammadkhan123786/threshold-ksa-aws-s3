import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Athlete } from "./athlete.entity";
import { Stock } from "./stock.entity";
import { SportCategory } from "./stocksCategory.entity";

@Entity()
export class AthleteStock {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Athlete, (athlete) => athlete.assignedStock, {
        onDelete: "CASCADE",
    })
    athlete: Athlete;

    @ManyToOne(() => Stock, { onDelete: "CASCADE" })
    stock: Stock;

    @ManyToOne(() => SportCategory, { onDelete: "CASCADE" })
    category: SportCategory;

    @Column({ type: "varchar", nullable: false })
    size: string;

    @Column({ default: 1 })
    quantity: number;
}
