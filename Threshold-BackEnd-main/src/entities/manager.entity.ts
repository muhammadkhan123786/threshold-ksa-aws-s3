import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    JoinColumn,
    ManyToMany,
    OneToMany,
    JoinTable,
    BeforeInsert,
} from "typeorm";
import {
    IsUUID,
    IsEnum,
    IsString,
    IsDate,
    IsOptional,
    IsArray,
} from "class-validator";
import { Branch } from "./branch.entity";
import { User } from "./user.entity";
import { Gender, Nationality } from "src/enums/athletes.enum";
import { Contract } from "./contract.entity";
import { Academy } from "./academy.entity";
import { sportClubProfiles } from "./sportClubProfiles.entity";
import { AthleteBankDetails } from "./athleteBankDetails.entity";
import { Documents } from "./documents.entity";
import { MedicalInformation } from "./medical-information.entity";
import { MedicalFiles } from "./medical-files.entity";
import { MedicalHistory } from "./medical-history.entity";
import { generatePrefixedId } from "src/utils/id-generator";
import { WorkHistory } from "./workHistory.entity";
import { Team } from "./team.entity";

@Entity()
export class Manager {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: true, unique: true })
    managerId: string;

    @BeforeInsert()
    generateId() {
        if (!this.managerId) {
            this.managerId = generatePrefixedId("MNG");
        }
    }

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;

    @Column()
    @IsString()
    firstName: string;

    @Column()
    @IsString()
    lastName: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    nationality?: string;

    @Column({ type: "enum", enum: Gender })
    @IsEnum(Gender)
    gender: Gender;

    @Column({ type: "date" })
    @IsDate()
    birthday: Date;

    @Column()
    phone: string;

    @Column({ nullable: true })
    emergencyPhone: string;

    @Column()
    relationship: string;

    @Column({ nullable: true })
    educationalLevel: string;

    @Column({ type: "int" })
    experience: number;

    @Column()
    nationalId: string;

    @Column({ type: "date", nullable: true })
    nationalIdExpiration: Date;

    @Column({ nullable: true })
    @IsString()
    avatar: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    schoolName?: string;

    @Column("simple-array", { nullable: true })
    @IsOptional()
    @IsArray()
    languages?: string[];

    @OneToOne(() => User, { cascade: true })
    @JoinColumn()
    user: User;

    @OneToOne(() => MedicalInformation, { cascade: true, nullable: true })
    @JoinColumn()
    medicalInformation?: MedicalInformation;

    @OneToMany(() => MedicalFiles, (medicalFile) => medicalFile.manager)
    medicalFiles?: MedicalFiles[];

    @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.manager)
    medicalHistory?: MedicalHistory[];

    @OneToOne(() => AthleteBankDetails, (bankDetails) => bankDetails.manager, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    bankDetails?: AthleteBankDetails;

    @OneToMany(() => Documents, (document) => document.manager)
    documents: Documents[];

    @OneToOne(() => Contract, (contract) => contract.manager, {
        nullable: true,
    })
    @JoinColumn()
    contract?: Contract;

    @ManyToOne(() => Branch, (branch) => branch.managers, { nullable: true })
    branch: Branch;

    @ManyToOne(() => Academy, (academy) => academy.managers, {
        nullable: true,
    })
    academy: Academy;

    @ManyToMany(
        () => sportClubProfiles,
        (sportProfile) => sportProfile.mainManagers,
        { nullable: true }
    )
    @JoinTable()
    sportProfile: sportClubProfiles;

    @OneToMany(() => WorkHistory, (workHistory) => workHistory.manager)
    workHistory: WorkHistory[];

    @OneToOne(() => Team, { nullable: true })
    @JoinColumn()
    playingFor?: Team;
}
