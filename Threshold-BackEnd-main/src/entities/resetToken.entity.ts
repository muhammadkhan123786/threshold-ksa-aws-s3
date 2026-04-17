import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ResetToken {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    token: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;

    @ManyToOne(() => User, (user) => user.resetTokens, { onDelete: "CASCADE" })
    user: User;
}
