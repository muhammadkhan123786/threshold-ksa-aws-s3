import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { PublicLink } from "./publicLink.entity";

@Entity()
export class PublicLinkAccess {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    deviceIdentifier: string;

    @ManyToOne(() => PublicLink, (publicLink) => publicLink.accesses)
    publicLink: PublicLink;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
