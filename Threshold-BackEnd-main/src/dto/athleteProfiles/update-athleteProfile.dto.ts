import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateAthleteProfileDto } from "./create-athleteProfile.dto";
import {
    DecathlonOptions,
    EventType,
    HandStatus,
    HeptathlonOptions,
    HurdlesOptions,
    JumpsOptions,
    LongDistanceOptions,
    MiddleDistanceOptions,
    PlayerPosition,
    ProfileStatus,
    RelayOptions,
    RoadRunningEventsOptions,
    SportProfileType,
    SprintOptions,
    SteeplechaseOptions,
    ThrowsOptions,
    SwimmingIndividualEvents,
    SwimmingRelayEvents,
    SwimmingOpenWaterEvents,
    TennisSquad,
} from "src/enums/athletes.enum";

export class UpdateAthleteProfileDto extends PartialType(
    CreateAthleteProfileDto
) {
    @ApiProperty({ description: "", required: false, example: "" })
    status?: ProfileStatus;

    @ApiProperty({ description: "", required: false, example: "" })
    sport?: SportProfileType;

    @ApiProperty({ description: "", required: false, example: "" })
    eventType?: EventType;

    @ApiProperty({ description: "", required: false, example: "" })
    hand?: HandStatus;

    @ApiProperty({ description: "", required: false, example: "" })
    foot?: HandStatus;

    @ApiProperty({ description: "", required: false, example: "" })
    position?: PlayerPosition;

    @ApiProperty({
        isArray: true,
        description: "Array of sprint events",
        required: false,
        example: [],
    })
    sprint?: SprintOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of middle-distance events",
        required: false,
        example: [],
    })
    middleDistance?: MiddleDistanceOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of long-distance events",
        required: false,
        example: [],
    })
    longDistance?: LongDistanceOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of hurdles events",
        required: false,
        example: [],
    })
    hurdles?: HurdlesOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of relay events",
        required: false,
        example: [],
    })
    relay?: RelayOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of steeplechase events",
        required: false,
        example: [],
    })
    steeplechase?: SteeplechaseOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of jumps events",
        required: false,
        example: [],
    })
    jumps?: JumpsOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of throws events",
        required: false,
        example: [],
    })
    throws?: ThrowsOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of heptathlon events",
        required: false,
        example: [],
    })
    heptathlon?: HeptathlonOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of decathlon events",
        required: false,
        example: [],
    })
    decathlon?: DecathlonOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of 5 kilometers events",
        required: false,
        example: [],
    })
    five_kilometers?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of 10 kilometers events",
        required: false,
        example: [],
    })
    ten_kilometers?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of half marathon events",
        required: false,
        example: [],
    })
    half_marathon?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        description: "Array of marathon events",
        required: false,
        example: [],
    })
    marathon?: RoadRunningEventsOptions[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of freestyle events",
        example: [],
    })
    freestyle?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of backstroke events",
        example: [],
    })
    backstroke?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of breaststroke events",
        example: [],
    })
    breaststroke?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of butterfly events",
        example: [],
    })
    butterfly?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingIndividualEvents,
        description: "Array of individual medley events",
        example: [],
    })
    im?: SwimmingIndividualEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingRelayEvents,
        description: "Array of freestyle relay events",
        example: [],
    })
    freestyleRelay?: SwimmingRelayEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingRelayEvents,
        description: "Array of medley relay events",
        example: [],
    })
    medleyRelay?: SwimmingRelayEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: SwimmingOpenWaterEvents,
        description: "Array of open water swimming events",
        example: [],
    })
    openWaterSwimming?: SwimmingOpenWaterEvents[];

    @ApiProperty({
        isArray: true,
        required: false,
        enum: TennisSquad,
        description: "Array of tennis squad options",
        example: [],
    })
    squad?: TennisSquad[];

    @ApiProperty({
        required: false,
        description: "Enter the related academy ID",
    })
    academy?: string;

    @ApiProperty({
        required: false,
        description: "Enter the related athlete ID",
    })
    athlete?: string;
}
