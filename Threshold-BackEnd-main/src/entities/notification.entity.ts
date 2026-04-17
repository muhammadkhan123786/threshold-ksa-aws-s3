import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column({ nullable: true })
    category?: string;

    @Column({ nullable: true })
    topic: string;

    @ManyToMany(() => User, (user) => user.seenNotifications)
    @JoinTable()
    seenByUsers?: User[];

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
