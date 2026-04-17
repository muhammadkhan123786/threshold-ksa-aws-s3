import { Athlete } from "./athlete.entity";
import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";
import { IsUUID } from "class-validator";
import {
    ProfileStatus,
    SportProfileType,
    EventType,
    HandStatus,
    PlayerPosition,
    SprintOptions,
    MiddleDistanceOptions,
    LongDistanceOptions,
    HurdlesOptions,
    RelayOptions,
    SteeplechaseOptions,
    JumpsOptions,
    ThrowsOptions,
    HeptathlonOptions,
    DecathlonOptions,
    RoadRunningEventsOptions,
    SwimmingIndividualEvents,
    SwimmingRelayEvents,
    SwimmingOpenWaterEvents,
    TennisSquad,
} from "src/enums/athletes.enum";
import { Academy } from "./academy.entity";

@Entity()
export class AthleteProfile {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column({
        nullable: false,
        type: "enum",
        enum: ProfileStatus,
    })
    status: ProfileStatus;

    @Column({
        nullable: false,
        type: "enum",
        enum: SportProfileType,
    })
    sport: SportProfileType;

    @Column({
        nullable: true,
        type: "enum",
        enum: EventType,
    })
    eventType?: EventType;

    @Column({
        nullable: true,
        type: "enum",
        enum: HandStatus,
    })
    hand?: HandStatus;

    @Column({
        nullable: true,
        type: "enum",
        enum: HandStatus,
    })
    foot?: HandStatus;

    @Column({
        nullable: true,
        type: "enum",
        enum: PlayerPosition,
    })
    position?: PlayerPosition;

    @Column({
        type: "simple-array",
        nullable: true,
    })
    sprint?: SprintOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    middleDistance?: MiddleDistanceOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    longDistance?: LongDistanceOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    hurdles?: HurdlesOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    relay?: RelayOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    steeplechase?: SteeplechaseOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    jumps?: JumpsOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    throws?: ThrowsOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    heptathlon?: HeptathlonOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    decathlon?: DecathlonOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    five_kilometers?: RoadRunningEventsOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    ten_kilometers?: RoadRunningEventsOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    half_marathon?: RoadRunningEventsOptions[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    marathon?: RoadRunningEventsOptions[];

    // New columns for swimming events
    @Column({
        type: "simple-array",
        nullable: true,
    })
    freestyle?: SwimmingIndividualEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    backstroke?: SwimmingIndividualEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    breaststroke?: SwimmingIndividualEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    butterfly?: SwimmingIndividualEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    im?: SwimmingIndividualEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    freestyleRelay?: SwimmingRelayEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    medleyRelay?: SwimmingRelayEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    openWaterSwimming?: SwimmingOpenWaterEvents[];

    @Column({
        type: "simple-array",
        nullable: true,
    })
    squad?: TennisSquad[];

    @ManyToOne(() => Athlete, (athlete) => athlete.athleteProfiles)
    athlete: Athlete;

    @ManyToOne(() => Academy, (academy) => academy.athleteProfiles)
    academy: Academy;
}
