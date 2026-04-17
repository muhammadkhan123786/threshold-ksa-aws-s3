import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    JoinColumn,
    BeforeInsert,
} from "typeorm";
import {
    IsUUID,
    IsString,
    IsDate,
    IsInt,
    IsEnum,
    Matches,
    IsArray,
    IsOptional,
} from "class-validator";
import { Academy } from "./academy.entity";
import { Team } from "./team.entity";
import { User } from "./user.entity";
import { ContractDetails } from "./contractDetails.entity";
import { Branch } from "./branch.entity";
import { Gender, Nationality, Relationship } from "src/enums/athletes.enum";
import { sportClubProfiles } from "./sportClubProfiles.entity";
import { ClubAdminRole } from "src/enums/admin-type.enum";
import { MedicalInformation } from "./medical-information.entity";
import { MedicalHistory } from "./medical-history.entity";
import { MedicalFiles } from "./medical-files.entity";
import { AthleteBankDetails } from "./athleteBankDetails.entity";
import { Documents } from "./documents.entity";
import { Contract } from "./contract.entity";
import { generatePrefixedId } from "src/utils/id-generator";
import { WorkHistory } from "./workHistory.entity";

@Entity()
export class ClubAdmin {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ type: "varchar", nullable: true, unique: true })
    adminId: string;

    @BeforeInsert()
    generateId() {
        if (!this.adminId) {
            this.adminId = generatePrefixedId("ADM");
        }
    }

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @Column({ nullable: true })
    @IsString()
    avatarUrl?: string;

    @Column({ nullable: true })
    @IsString()
    avatarPath?: string;

    @IsInt()
    @Column({ nullable: false })
    experience: number;

    @IsDate()
    @Column({ nullable: true })
    birthday?: Date;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    emergencyPhone?: string;

    @IsString()
    @Column({ nullable: true })
    @IsOptional()
    nationality?: string;

    @IsString()
    @Column({ nullable: true })
    relationship?: string;

    @IsEnum(ClubAdminRole)
    @Column({
        type: "enum",
        enum: ClubAdminRole,
        nullable: true,
        default: ClubAdminRole.CLUB_ADMIN_ASSISTANT,
    })
    type: ClubAdminRole;

    @IsEnum(Gender)
    @Column({
        type: "enum",
        enum: Gender,
        nullable: false,
    })
    gender: Gender;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    firstName: string;

    @IsDate()
    @Column({ nullable: true })
    joinDate?: Date;

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    height?: number;

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    weight?: number;

    @Column({ nullable: true })
    levelEducation?: string;

    @Column({ nullable: true })
    @IsString()
    schoolName?: string;

    @Column({ type: "jsonb", nullable: true })
    @IsArray()
    @IsString({ each: true })
    languages?: string[];

    // ------------------
    //     Relations
    // ------------------

    @ManyToOne(() => Academy, (academy) => academy.clubAdmins, {
        nullable: true,
    })
    academy: Academy;

    @ManyToOne(() => Branch, (branch) => branch.clubAdmins, {
        nullable: true,
    })
    branch: Branch;

    @OneToOne(() => Contract, (contract) => contract.clubAdmin, {
        nullable: true,
    })
    @JoinColumn()
    contract?: Contract;

    @OneToOne(() => User, (user) => user.clubAdmin, {
        cascade: true,
    })
    @JoinColumn()
    user: User;

    @OneToOne(() => Team, { nullable: true })
    @JoinColumn()
    playingFor?: Team;

    @OneToOne(
        () => ContractDetails,
        (contractDetails) => contractDetails.clubAdmin,
        {
            cascade: ["insert", "update"],
            nullable: true,
        }
    )
    @JoinColumn()
    contractDetails?: ContractDetails;

    @OneToMany(() => Team, (team) => team.clubAdmin)
    teams: Team[];

    @ManyToOne(
        () => sportClubProfiles,
        (sportProfile) => sportProfile.clubAdmins,
        {
            nullable: true,
        }
    )
    sportProfile: sportClubProfiles;

    @OneToOne(() => MedicalInformation, { cascade: true, nullable: true })
    @JoinColumn()
    medicalInformation?: MedicalInformation;

    @OneToMany(() => MedicalFiles, (medicalFile) => medicalFile.clubAdmin)
    medicalFiles?: MedicalFiles[];

    @OneToMany(
        () => MedicalHistory,
        (medicalHistory) => medicalHistory.clubAdmin
    )
    medicalHistory?: MedicalHistory[];

    @OneToOne(
        () => AthleteBankDetails,
        (bankDetails) => bankDetails.clubAdmin,
        {
            cascade: true,
            nullable: true,
        }
    )
    @JoinColumn()
    bankDetails?: AthleteBankDetails;

    @OneToMany(() => Documents, (document) => document.clubAdmin)
    documents: Documents[];

    @Column({ nullable: true })
    nationalId?: string;

    @Column({ type: "date", nullable: true })
    @IsDate()
    nationalIdExpiration?: Date;

    @OneToMany(() => WorkHistory, (workHistory) => workHistory.clubAdmin)
    workHistory: WorkHistory[];
}
