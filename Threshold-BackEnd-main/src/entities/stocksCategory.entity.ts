import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
} from "typeorm";

import { sportClubProfiles } from "./sportClubProfiles.entity";
import { CategoryType, MeasurementUnit } from "src/enums/stock.enum";
import { Stock } from "./stock.entity";
import { AthleteCategorySize } from "./athleteCategorySize.entity";

@Entity()
export class SportCategory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => sportClubProfiles, (profile) => profile.categories, {
        onDelete: "CASCADE",
        eager: true,
    })
    sportClubProfile: sportClubProfiles;

    @Column({
        type: "enum",
        enum: CategoryType,
        nullable: false,
    })
    categoryName: CategoryType;

    @Column({
        type: "enum",
        enum: MeasurementUnit,
        array: true,
        nullable: false,
    })
    measurementUnits: MeasurementUnit[];
    @Column({
        type: "jsonb",
        nullable: false,
        default: () => "'[]'",
    })
    sizeOptions: Array<{ size: string; requiredQuantity: number }>;

    @OneToMany(() => Stock, (stock) => stock.category)
    stocks: Stock[];

    @OneToMany(
        () => AthleteCategorySize,
        (athleteCategorySize) => athleteCategorySize.category
    )
    athleteCategorySizes: AthleteCategorySize[];

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;
}
