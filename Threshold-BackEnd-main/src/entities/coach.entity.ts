import { Academy } from "./academy.entity";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    DeleteDateColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import {
    IsArray,
    IsDate,
    IsEnum,
    IsInt,
    IsString,
    IsUUID,
    Matches,
    IsOptional,
} from "class-validator";
import { Team } from "./team.entity";
import {
    Gender,
    Nationality,
    Relationship,
    SportProfileType,
} from "src/enums/athletes.enum";
import { User } from "./user.entity";
import { Branch } from "./branch.entity";
import { sportClubProfiles } from "./sportClubProfiles.entity";
import { ClubCoachRole } from "src/enums/coach-type.enum";
import { ContractDetails } from "./contractDetails.entity";
import { AthleteBankDetails } from "./athleteBankDetails.entity";
import { MedicalInformation } from "./medical-information.entity";
import { MedicalFiles } from "./medical-files.entity";
import { MedicalHistory } from "./medical-history.entity";
import { Documents } from "./documents.entity";
import { Contract } from "./contract.entity";
import { WorkHistory } from "./workHistory.entity";

@Entity()
export class Coach {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;

    @Column({ nullable: true })
    @IsString()
    avatarUrl?: string;

    // --- columns ---

    @Column({
        nullable: true,
    })
    avatar: string;

    @IsInt()
    @Column({
        nullable: false,
    })
    experience: number;

    @IsDate()
    @Column({
        nullable: true,
    })
    birthday?: Date;

    @Column({ nullable: true })
    @IsString()
    phone?: string;

    @Column({
        nullable: true,
    })
    emergencyPhone: string;

    @Column({
        nullable: true,
    })
    @IsString()
    @IsOptional()
    nationality?: string;

    @IsString()
    @Column({ nullable: true })
    relationship?: string;

    @IsEnum(ClubCoachRole)
    @Column({
        type: "enum",
        enum: ClubCoachRole,
        nullable: true,
        default: ClubCoachRole.CLUB_COACH_ASSISTANT,
    })
    type: ClubCoachRole;

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    height?: number;

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    weight?: number;

    @Column({ nullable: true })
    levelEducation?: string;

    @Column({ nullable: true })
    schoolName?: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: Gender,
    })
    gender: string;

    @Column({
        nullable: false,
    })
    lastName: string;

    @Column({
        nullable: false,
    })
    firstName: string;

    @IsDate()
    @Column({
        nullable: true,
    })
    joinDate?: Date;

    @Column({
        nullable: true,
        type: "enum",
        enum: SportProfileType,
        default: SportProfileType.DEFAULT,
    })
    sport: string;

    @Column({ type: "jsonb", nullable: true })
    @IsArray()
    @IsString({ each: true })
    languages?: string[];

    @Column({ nullable: true })
    @IsString()
    country?: string;

    // --- relations ---
    @ManyToOne(() => Academy, (academy) => academy.coaches)
    academy: Academy;

    @OneToMany(() => Team, (team) => team.coach)
    teams: Team[];

    @OneToOne(() => User, { cascade: true })
    @JoinColumn()
    user: User;

    @OneToOne(
        () => ContractDetails,
        (contractDetails) => contractDetails.coach,
        {
            cascade: ["insert", "update"],
            nullable: true,
        }
    )
    @JoinColumn()
    contractDetails: ContractDetails;

    @OneToOne(() => AthleteBankDetails, (bankDetails) => bankDetails.coach, {
        cascade: true,
    })
    @JoinColumn()
    bankDetails: AthleteBankDetails;

    @ManyToOne(
        () => sportClubProfiles,
        (sportProfile) => sportProfile.coaches,
        {
            nullable: true,
        }
    )
    sportProfile: sportClubProfiles;

    @ManyToOne(() => Branch, (branch) => branch.coaches)
    branch: Branch;

    @OneToOne(() => Team, { nullable: true })
    @JoinColumn()
    playingFor?: Team;

    @ManyToMany(() => Team, (team) => team.subCoaches)
    @JoinTable({
        name: "team_sub_coaches",
        joinColumn: { name: "coach_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "team_id", referencedColumnName: "id" },
    })
    subTeams: Team[];

    @OneToOne(() => MedicalInformation, { cascade: true, nullable: true })
    @JoinColumn()
    medicalInformation: MedicalInformation;

    @OneToMany(() => MedicalFiles, (medicalFile) => medicalFile.coach)
    medicalFiles: MedicalFiles[];

    @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.coach)
    medicalHistory: MedicalHistory[];

    @OneToMany(() => Documents, (document) => document.coach)
    documents: Documents[];

    @OneToOne(() => Contract, (contract) => contract.coach, { nullable: true })
    @JoinColumn()
    contract?: Contract;

    @Column({ nullable: true })
    nationalId?: string;

    @Column({ type: "date", nullable: true })
    @IsDate()
    nationalIdExpiration?: Date;

    @OneToMany(() => WorkHistory, (workHistory) => workHistory.coach)
    workHistory: WorkHistory[];
}
