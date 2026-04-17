import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { Athlete } from "./athlete.entity";
import { SportCategory } from "./stocksCategory.entity";

@Entity()
export class AthleteCategorySize {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Athlete, (athlete) => athlete.categorySizes, {
        onDelete: "CASCADE",
    })
    athlete: Athlete;

    @ManyToOne(
        () => SportCategory,
        (category) => category.athleteCategorySizes,
        {
            onDelete: "CASCADE",
        }
    )
    category: SportCategory;

    @Column({
        type: "jsonb",
        nullable: false,
        default: () => "'[]'",
    })
    sizeOptions: Array<{
        size: string;
        requiredQuantity: number;
    }>;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;
}
