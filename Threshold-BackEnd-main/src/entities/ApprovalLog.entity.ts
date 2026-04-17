import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { IsUUID } from "class-validator";
import { User } from "./user.entity";
import { ApprovalAction } from "src/enums/approval-actions.enum";

@Entity()
export class ApprovalLog {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column({
        type: "enum",
        enum: ApprovalAction,
        nullable: false,
    })
    action: ApprovalAction;

    @ManyToOne(() => User, { nullable: true })
    performedBy?: User;

    @ManyToOne(() => User, { nullable: false })
    user: User;
}
