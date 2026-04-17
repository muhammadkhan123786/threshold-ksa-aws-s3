import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import {
    IsUUID,
    IsString,
    IsOptional,
    IsEnum,
    IsObject,
} from "class-validator";
import { Contract, ContractStatus, ContractType } from "./contract.entity";
import { User } from "./user.entity";

export enum AuditAction {
    CREATED = "Created",
    UPDATED = "Updated",
    DELETED = "Deleted",
    EXPIRED = "Expired",
    TERMINATED = "Terminated",
    RENEWED = "Renewed",
}

@Entity("contract_audit")
export class ContractAudit {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @ManyToOne(() => Contract, { onDelete: "CASCADE" })
    @JoinColumn()
    contract: Contract;

    @Column()
    @IsString()
    contractId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn()
    performedBy: User;

    @Column({ type: "enum", enum: AuditAction })
    @IsEnum(AuditAction)
    action: AuditAction;

    @Column({ type: "jsonb", nullable: true })
    @IsObject()
    @IsOptional()
    previousValues?: any;

    @Column({ type: "jsonb", nullable: true })
    @IsObject()
    @IsOptional()
    newValues?: any;

    @Column({ type: "text", nullable: true })
    @IsString()
    @IsOptional()
    comments?: string;

    @CreateDateColumn({ type: "timestamp" })
    timestamp: Date;
}
