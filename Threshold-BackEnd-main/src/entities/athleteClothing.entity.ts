import { IsUUID } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Athlete } from "./athlete.entity";
import { ClothingSize } from "src/enums/clothing-size";

@Entity()
export class AthleteClothing {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ type: "enum", enum: ClothingSize, nullable: true })
    tShirtSize: ClothingSize;

    @Column({ type: "enum", enum: ClothingSize, nullable: true })
    pantSize: ClothingSize;

    @Column({ nullable: true })
    shoeSize: string;

    @Column({ type: "enum", enum: ClothingSize, nullable: true })
    driFitSize: ClothingSize;

    @OneToOne(() => Athlete, (athlete) => athlete.athleteClothing)
    athlete: Athlete;
}
