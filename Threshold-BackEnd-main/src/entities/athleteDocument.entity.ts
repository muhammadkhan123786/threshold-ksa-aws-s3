import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { IsUUID } from "class-validator";
import { Athlete } from "./athlete.entity";
import { DocumentType } from "src/enums/document-type.enum";

@Entity()
export class AthleteDocument {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ type: "enum", enum: DocumentType, nullable: false })
    type: DocumentType;

    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => Athlete, (athlete) => athlete.documents)
    athlete: Athlete;

    @Column({ nullable: false })
    lastUpdated: Date;
}
