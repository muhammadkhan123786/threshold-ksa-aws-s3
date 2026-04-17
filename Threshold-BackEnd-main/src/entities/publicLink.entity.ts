import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { IsUUID, IsDate, IsInt } from "class-validator";
import { Academy } from "./academy.entity";
import { User } from "./user.entity";
import { PublicLinkAccess } from "./publicLinkAccess.entity";
@Entity()
export class PublicLink {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @ManyToOne(() => Academy, { nullable: false })
    academy: Academy;

    @Column({ type: "timestamp", nullable: false })
    @IsDate()
    expirationDate: Date;

    @Column({ type: "int", nullable: false })
    @IsInt()
    limitNumber: number;

    @ManyToOne(() => User, { nullable: true })
    createdBy: User;

    @Column({ type: "boolean", default: true })
    isActive: boolean;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @OneToMany(() => PublicLinkAccess, (access) => access.publicLink)
    accesses: PublicLinkAccess[];
}
