import { SessionRecord } from "./sessionRecord.entity";
import { AthleteProfile } from "./athleteProfile.entity";
import { AthleteBattery } from "./athleteBattery.entity";
import { IsDate, IsString } from "class-validator";
import { Academy } from "./academy.entity";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    OneToOne,
    DeleteDateColumn,
    JoinColumn,
    BeforeInsert,
} from "typeorm";
import { IsUUID } from "class-validator";
import {
    Education,
    Gender,
    Nationality,
    YesNo,
    FoodAllergies,
    AvailabilityStatus,
    Consideration,
    Relationship,
    SkillLevel,
} from "src/enums/athletes.enum";
import { AthleteBiometric } from "./athleteBiometric.entity";
import { Team } from "./team.entity";
import { AthleteSubscription } from "./athleteSubscription.entity";
import { Branch } from "./branch.entity";
import { AthleteClothing } from "./athleteClothing.entity";
import { AthleteBankDetails } from "./athleteBankDetails.entity";
import { AthleteDocument } from "./athleteDocument.entity";
import { EmergencyContact } from "./emergencyContact.entity";
import { AthleteHealthRecords } from "./athleteHealthRecords.entity";
import { AthleteRecord } from "./athleteRecord.entity";
import { sportClubProfiles } from "./sportClubProfiles.entity";
import { AthleteStock } from "./athleteStock";
import { AthleteCategorySize } from "./athleteCategorySize.entity";
import { Contract } from "./contract.entity";
import { generatePrefixedId } from "src/utils/id-generator";
import { ClubPlayerBiometric } from "./clubPlayerBiometric.entity";

@Entity()
export class Athlete {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ type: "varchar", nullable: true, unique: true })
    athleteId: string;

    @BeforeInsert()
    generateId() {
        if (!this.athleteId) {
            this.athleteId = generatePrefixedId("MNG");
        }
    }

    @Column({
        nullable: true,
    })
    experience?: string;

    @Column({
        nullable: true,
    })
    avatarUrl?: string;

    @Column({
        nullable: true,
    })
    schoolName?: string;

    @Column({
        type: "float",
        nullable: true,
    })
    weight?: number;

    @Column({
        type: "float",
        nullable: true,
    })
    height?: number;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;

    @ManyToOne(() => Branch, (branch) => branch.athletes)
    branch: Branch;

    // --- columns ---
    @IsDate()
    @Column({
        nullable: true,
    })
    dateOfUpdating: string;

    @IsDate()
    @Column({
        nullable: true,
    })
    joinDate: string;

    @IsDate()
    @Column({
        nullable: false,
    })
    dateOfBirth: string;

    @Column({
        nullable: false,
    })
    nin: string;

    @Column({
        type: "date",
        nullable: true,
    })
    ninExpirationDate?: Date;

    @Column({
        nullable: true,
    })
    level: string;

    @Column({
        nullable: true,
        default: "",
    })
    avatar: string;

    @Column({
        nullable: false,
    })
    lastName: string;

    @Column({
        nullable: false,
    })
    firstName: string;

    @Column({
        type: "varchar",
        default: "FATHER",
    })
    relationship: string;

    @Column({
        nullable: true,
    })
    category?: string;

    @Column({
        nullable: true,
    })
    position?: string;

    @Column({
        nullable: true,
    })
    contactNumber?: string;

    @Column({
        nullable: true,
    })
    emergencyPhone?: string;

    @Column({
        nullable: true,
    })
    @IsString()
    nationality?: string;

    @Column({
        nullable: true,
    })
    education?: string;

    @Column({
        type: "varchar",
        default: "NO",
        nullable: true,
    })
    allergies?: string;

    @Column("text", { nullable: true })
    chronicDisease?: string;

    @Column({
        nullable: true,
        default: "OTHER",
    })
    foodAllergies?: string;

    @Column({ nullable: true })
    foodAllergiesUrl?: string;

    @Column({
        type: "varchar",
        nullable: true,
        default: "available",
    })
    availabilityStatus?: string;

    @Column({
        type: "varchar",
        default: "OTHER",
        nullable: true,
    })
    consideration?: string;

    @Column({ nullable: true })
    considerationUrl?: string;

    @Column({
        type: "varchar",
        default: "MALE",
    })
    gender: string;

    @Column("text", { array: true, nullable: true, default: [] })
    @IsString({ each: true })
    chronic?: string[];

    @Column({
        type: "varchar",
        default: "NO",
        nullable: true,
    })
    injury?: string;

    @Column({
        type: "text",
        nullable: true,
        default: "Beginner",
    })
    clublevel?: string;

    // --- relations ---
    @OneToMany(() => SessionRecord, (sessionRecord) => sessionRecord.athlete)
    sessionRecords: SessionRecord[];

    @OneToMany(() => AthleteProfile, (athleteProfile) => athleteProfile.athlete)
    athleteProfiles: AthleteProfile[];

    @OneToMany(() => AthleteBattery, (athleteBattery) => athleteBattery.athlete)
    athleteBatteries: AthleteBattery[];

    @OneToMany(
        () => AthleteBiometric,
        (athleteBiometric) => athleteBiometric.athlete
    )
    athleteBiometrics: AthleteBiometric[];

    @ManyToOne(() => Academy, (academy) => academy.athletes)
    academy: Academy;

    @ManyToMany(() => Team, (team) => team.athletes)
    @JoinTable()
    teams: Team[];

    @OneToOne(() => AthleteSubscription, (subscription) => subscription.athlete)
    subscription: AthleteSubscription;

    @OneToOne(() => AthleteClothing, (clothing) => clothing.athlete, {
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    athleteClothing: AthleteClothing;

    @OneToOne(() => AthleteBankDetails, (bankDetails) => bankDetails.athlete, {
        cascade: true,
        eager: true,
    })
    @JoinColumn()
    bankDetails: AthleteBankDetails;

    @OneToMany(() => AthleteDocument, (document) => document.athlete)
    documents: AthleteDocument[];

    @OneToOne(
        () => EmergencyContact,
        (emergencyContact) => emergencyContact.athlete,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn()
    emergencyContact: EmergencyContact;

    @OneToMany(() => AthleteHealthRecords, (record) => record.athlete, {
        cascade: true,
    })
    healthRecords: AthleteHealthRecords[];

    @OneToMany(() => AthleteRecord, (record) => record.athlete)
    records: AthleteRecord[];

    @ManyToOne(
        () => sportClubProfiles,
        (sportProfile) => sportProfile.athletes,
        {
            nullable: true,
        }
    )
    sportProfile: sportClubProfiles;

    @Column("text", { array: true, nullable: true })
    allergyDetails: string[];

    @Column("text", { array: true, nullable: true })
    chronicConditions: string[];

    @Column("text", { array: true, nullable: true })
    healthFactors: string[];

    @OneToMany(() => AthleteStock, (athleteStock) => athleteStock.athlete)
    assignedStock: AthleteStock[];

    @OneToMany(
        () => AthleteCategorySize,
        (athleteCategorySize) => athleteCategorySize.athlete
    )
    categorySizes: AthleteCategorySize[];

    @OneToOne(() => Contract, (contract) => contract.player, { nullable: true })
    @JoinColumn()
    contract?: Contract;

    @OneToMany(
        () => ClubPlayerBiometric,
        (clubPlayerBiometric) => clubPlayerBiometric.player
    )
    clubPlayerBiometrics: ClubPlayerBiometric[];
}
