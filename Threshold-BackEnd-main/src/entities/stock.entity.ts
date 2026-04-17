import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { MeasurementUnit } from "src/enums/stock.enum";
import { sportClubProfiles } from "./sportClubProfiles.entity";
import { SportCategory } from "./stocksCategory.entity";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => sportClubProfiles, (profile) => profile.categories, {
        onDelete: "CASCADE",
        eager: true,
    })
    sportClubProfile: sportClubProfiles;

    @ManyToOne(() => SportCategory, (category) => category.stocks, {
        onDelete: "CASCADE",
    })
    category: SportCategory;

    @Column({
        type: "enum",
        enum: MeasurementUnit,
        nullable: false,
    })
    measurementUnit: MeasurementUnit;

    @Column({
        type: "jsonb",
        nullable: false,
        default: () => "'[]'",
    })
    sizeOptions: Array<{
        size: string;
        quantity: number;
    }>;

    @Column({
        type: "int",
        default: 0,
    })
    totalQuantity: number;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;
}
