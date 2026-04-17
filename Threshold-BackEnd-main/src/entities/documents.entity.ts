import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import { IsString } from "class-validator";
import { Coach } from "./coach.entity";
import { DocumentType } from "src/enums/document-type.enum";
import { ClubAdmin } from "./clubAdmin.entity";
import { Manager } from "./manager.entity";

@Entity("documents")
export class Documents {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: DocumentType, nullable: false })
    type: DocumentType;

    @Column()
    @IsString()
    documentUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => Coach, (coach) => coach.documents, {
        onDelete: "CASCADE",
        nullable: true,
    })
    coach?: Coach;

    @ManyToOne(() => ClubAdmin, (clubAdmin) => clubAdmin.documents, {
        onDelete: "CASCADE",
        nullable: true,
    })
    clubAdmin?: ClubAdmin;

    @ManyToOne(() => Manager, (manager) => manager.documents, {
        onDelete: "CASCADE",
        nullable: true,
    })
    manager?: Manager;
}
