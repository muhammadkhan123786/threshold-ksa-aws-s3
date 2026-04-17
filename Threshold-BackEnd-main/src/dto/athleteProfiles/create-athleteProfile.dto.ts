import { ApiProperty } from "@nestjs/swagger";
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

export class CreateAthleteProfileDto {
    @ApiProperty({
        required: true,
        enum: ProfileStatus,
    })
    @ApiProperty({
        description: "Provide a valid status.",
        example: "Sample status",
        required: true,
    })
    status: ProfileStatus;

    @ApiProperty({
        required: true,
        enum: SportProfileType,
    })
    @ApiProperty({
        description: "Provide a valid sport.",
        example: "Sample sport",
        required: true,
    })
    sport: SportProfileType;

    @ApiProperty({
        required: false,
        enum: EventType,
    })
    eventType?: EventType;

    @ApiProperty({
        required: false,
        enum: HandStatus,
    })
    hand?: HandStatus;

    @ApiProperty({
        required: false,
        enum: HandStatus,
    })
    foot?: HandStatus;

    @ApiProperty({
        required: false,
        enum: PlayerPosition,
    })
    position?: PlayerPosition;

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SprintOptions,
        description: "Array of sprint events",
    })
    sprint?: SprintOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: MiddleDistanceOptions,
        description: "Array of middle-distance events",
    })
    middleDistance?: MiddleDistanceOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: LongDistanceOptions,
        description: "Array of long-distance events",
    })
    longDistance?: LongDistanceOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: HurdlesOptions,
        description: "Array of hurdles events",
    })
    hurdles?: HurdlesOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: RelayOptions,
        description: "Array of relay events",
    })
    relay?: RelayOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SteeplechaseOptions,
        description: "Array of steeplechase events",
    })
    steeplechase?: SteeplechaseOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: JumpsOptions,
        description: "Array of jumps events",
    })
    jumps?: JumpsOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: ThrowsOptions,
        description: "Array of throws events",
    })
    throws?: ThrowsOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: HeptathlonOptions,
        description: "Array of heptathlon events",
    })
    heptathlon?: HeptathlonOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: DecathlonOptions,
        description: "Array of decathlon events",
    })
    decathlon?: DecathlonOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: RoadRunningEventsOptions,
        description: "Array of 5 kilometers events",
    })
    five_kilometers?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: RoadRunningEventsOptions,
        description: "Array of 10 kilometers events",
    })
    ten_kilometers?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: RoadRunningEventsOptions,
        description: "Array of half marathon events",
    })
    half_marathon?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: RoadRunningEventsOptions,
        description: "Array of marathon events",
    })
    marathon?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of freestyle events",
    })
    freestyle?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of backstroke events",
    })
    backstroke?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of breaststroke events",
    })
    breaststroke?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of butterfly events",
    })
    butterfly?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of individual medley events",
    })
    im?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingRelayEvents,
        description: "Array of freestyle relay events",
    })
    freestyleRelay?: SwimmingRelayEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingRelayEvents,
        description: "Array of medley relay events",
    })
    medleyRelay?: SwimmingRelayEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingOpenWaterEvents,
        description: "Array of open water swimming events",
    })
    openWaterSwimming?: SwimmingOpenWaterEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: TennisSquad,
        description: "Array of tennis squad options",
    })
    squad?: TennisSquad[];

    @ApiProperty({
        required: true,
        description: "Enter the related academy ID",
    })
    @ApiProperty({
        description: "Provide a valid academy.",
        example: "Sample academy",
        required: true,
    })
    academy: string;

    @ApiProperty({
        required: true,
        description: "Enter the related athlete ID",
    })
    @ApiProperty({
        description: "Provide a valid athlete.",
        example: "Sample athlete",
        required: true,
    })
    athlete: string;
}
