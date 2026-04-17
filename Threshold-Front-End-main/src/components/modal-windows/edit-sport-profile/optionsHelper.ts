import {
    TrackEventsOptions,
    FieldEventsOptions,
    CombinedEventsOptions,
    RoadRunningEventsOptions,
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
    IndividualSwimmingEventFields,
    FreestyleDistances,
    BackstrokeDistances,
    BreaststrokeDistances,
    ButterflyDistances,
    IMDistances,
    RelaySwimmingEventFields,
    OpenWaterSwimmingEventFields,
    TennisSquad,
} from 'libs/enums/athlete';

interface Options {
    trackEvents: { value: TrackEventsOptions; label: string }[];
    fieldEvents: { value: FieldEventsOptions; label: string }[];
    combinedEvents: { value: CombinedEventsOptions; label: string }[];
    roadRunningEvents: { value: RoadRunningEventsOptions; label: string }[];
    sprints: { value: SprintOptions; label: string }[];
    middleDistance: { value: MiddleDistanceOptions; label: string }[];
    longDistance: { value: LongDistanceOptions; label: string }[];
    hurdles: { value: HurdlesOptions; label: string }[];
    relays: { value: RelayOptions; label: string }[];
    steeplechase: { value: SteeplechaseOptions; label: string }[];
    jumps: { value: JumpsOptions; label: string }[];
    throws: { value: ThrowsOptions; label: string }[];
    heptathlon: { value: HeptathlonOptions; label: string }[];
    decathlon: { value: DecathlonOptions; label: string }[];
    fiveKilometers: { value: RoadRunningEventsOptions; label: string }[];
    tenKilometers: { value: RoadRunningEventsOptions; label: string }[];
    halfMarathon: { value: RoadRunningEventsOptions; label: string }[];
    marathon: { value: RoadRunningEventsOptions; label: string }[];
    individualEvents: { value: IndividualSwimmingEventFields; label: string }[];
    freestyleDistances: { value: FreestyleDistances; label: string }[];
    backstrokeDistances: { value: BackstrokeDistances; label: string }[];
    breaststrokeDistances: { value: BreaststrokeDistances; label: string }[];
    butterflyDistances: { value: ButterflyDistances; label: string }[];
    imDistances: { value: IMDistances; label: string }[];
    relayEvents: { value: RelaySwimmingEventFields; label: string }[];
    openWaterSwimming: { value: OpenWaterSwimmingEventFields; label: string }[];
    tennisSquad: { value: TennisSquad; label: string }[];
}

export const getOptions = (trans: (key: string) => string): Options => ({
    trackEvents: [
        { value: TrackEventsOptions.SPRINTS, label: trans('sport.trackEvents.sprints') },
        {
            value: TrackEventsOptions.MIDDLE_DISTANCE,
            label: trans('sport.trackEvents.middle_distance'),
        },
        {
            value: TrackEventsOptions.LONG_DISTANCE,
            label: trans('sport.trackEvents.long_distance'),
        },
        { value: TrackEventsOptions.HURDLES, label: trans('sport.trackEvents.hurdles') },
        { value: TrackEventsOptions.RELAYS, label: trans('sport.trackEvents.relays') },
        { value: TrackEventsOptions.STEEPLECHASE, label: trans('sport.trackEvents.steeplechase') },
    ],
    fieldEvents: [
        { value: FieldEventsOptions.JUMPS, label: trans('sport.fieldEvents.jumps') },
        { value: FieldEventsOptions.THROWS, label: trans('sport.fieldEvents.throws') },
    ],
    combinedEvents: [
        {
            value: CombinedEventsOptions.HEPTATHLON,
            label: trans('sport.combinedEvents.heptathlon'),
        },
        { value: CombinedEventsOptions.DECATHLON, label: trans('sport.combinedEvents.decathlon') },
    ],
    roadRunningEvents: [
        {
            value: RoadRunningEventsOptions.FIVE_KILOMETERS,
            label: trans('sport.roadRunningEvents.5_kilometers'),
        },
        {
            value: RoadRunningEventsOptions.TEN_KILOMETERS,
            label: trans('sport.roadRunningEvents.10_kilometers'),
        },
        {
            value: RoadRunningEventsOptions.HALF_MARATHON,
            label: trans('sport.roadRunningEvents.half_marathon'),
        },
        {
            value: RoadRunningEventsOptions.MARATHON,
            label: trans('sport.roadRunningEvents.marathon'),
        },
    ],
    sprints: [
        { value: SprintOptions.ONE_HUNDRED_METERS, label: trans('sport.sprints.100_meters') },
        { value: SprintOptions.TWO_HUNDRED_METERS, label: trans('sport.sprints.200_meters') },
        { value: SprintOptions.FOUR_HUNDRED_METERS, label: trans('sport.sprints.400_meters') },
    ],
    middleDistance: [
        {
            value: MiddleDistanceOptions.EIGHT_HUNDRED_METERS,
            label: trans('sport.middleDistance.800_meters'),
        },
        {
            value: MiddleDistanceOptions.FIFTEEN_HUNDRED_METERS,
            label: trans('sport.middleDistance.1500_meters'),
        },
    ],
    longDistance: [
        {
            value: LongDistanceOptions.FIVE_THOUSAND_METERS,
            label: trans('sport.longDistance.5000_meters'),
        },
        {
            value: LongDistanceOptions.TEN_THOUSAND_METERS,
            label: trans('sport.longDistance.10000_meters'),
        },
    ],
    hurdles: [
        {
            value: HurdlesOptions.ONE_HUNDRED_METERS_HURDLES,
            label: trans('sport.hurdles.100_meters_hurdles'),
        },
        {
            value: HurdlesOptions.ONE_HUNDRED_TEN_METERS_HURDLES,
            label: trans('sport.hurdles.110_meters_hurdles'),
        },
        {
            value: HurdlesOptions.FOUR_HUNDRED_METERS_HURDLES,
            label: trans('sport.hurdles.400_meters_hurdles'),
        },
    ],
    relays: [
        {
            value: RelayOptions.FOUR_BY_ONE_HUNDRED_METERS_RELAY,
            label: trans('sport.relays.4x100_meters_relay'),
        },
        {
            value: RelayOptions.FOUR_BY_FOUR_HUNDRED_METERS_RELAY,
            label: trans('sport.relays.4x400_meters_relay'),
        },
    ],
    steeplechase: [
        {
            value: SteeplechaseOptions.THREE_THOUSAND_METERS_STEEPLECHASE,
            label: trans('sport.steeplechase.3000_meters_steeplechase'),
        },
    ],
    jumps: [
        { value: JumpsOptions.LONG_JUMP, label: trans('sport.jumps.long_jump') },
        { value: JumpsOptions.TRIPLE_JUMP, label: trans('sport.jumps.triple_jump') },
        { value: JumpsOptions.HIGH_JUMP, label: trans('sport.jumps.high_jump') },
        { value: JumpsOptions.POLE_VAULT, label: trans('sport.jumps.pole_vault') },
    ],
    throws: [
        { value: ThrowsOptions.SHOT_PUT, label: trans('sport.throws.shot_put') },
        { value: ThrowsOptions.DISCUS_THROW, label: trans('sport.throws.discus_throw') },
        { value: ThrowsOptions.JAVELIN_THROW, label: trans('sport.throws.javelin_throw') },
        { value: ThrowsOptions.HAMMER_THROW, label: trans('sport.throws.hammer_throw') },
    ],
    heptathlon: [
        {
            value: HeptathlonOptions.HEPTATHLON,
            label: trans('sport.combinedEvents.heptathlon'),
        },
    ],
    decathlon: [
        { value: DecathlonOptions.DECATHLON, label: trans('sport.combinedEvents.decathlon') },
    ],
    fiveKilometers: [
        {
            value: RoadRunningEventsOptions.FIVE_KILOMETERS,
            label: trans('sport.roadRunningEvents.5_kilometers'),
        },
    ],
    tenKilometers: [
        {
            value: RoadRunningEventsOptions.TEN_KILOMETERS,
            label: trans('sport.roadRunningEvents.10_kilometers'),
        },
    ],
    halfMarathon: [
        {
            value: RoadRunningEventsOptions.HALF_MARATHON,
            label: trans('sport.roadRunningEvents.half_marathon'),
        },
    ],
    marathon: [
        {
            value: RoadRunningEventsOptions.MARATHON,
            label: trans('sport.roadRunningEvents.marathon'),
        },
    ],
    individualEvents: [
        {
            value: IndividualSwimmingEventFields.FREESTYLE,
            label: trans('sport.individualEvents.freestyle'),
        },
        {
            value: IndividualSwimmingEventFields.BACKSTROKE,
            label: trans('sport.individualEvents.backstroke'),
        },
        {
            value: IndividualSwimmingEventFields.BREASTSTROKE,
            label: trans('sport.individualEvents.breaststroke'),
        },
        {
            value: IndividualSwimmingEventFields.BUTTERFLY,
            label: trans('sport.individualEvents.butterfly'),
        },
        { value: IndividualSwimmingEventFields.IM, label: trans('sport.individualEvents.im') },
    ],
    freestyleDistances: [
        {
            value: FreestyleDistances.FREESTYLE_50_METERS,
            label: trans('sport.freestyle.50_meters'),
        },
        {
            value: FreestyleDistances.FREESTYLE_100_METERS,
            label: trans('sport.freestyle.100_meters'),
        },
        {
            value: FreestyleDistances.FREESTYLE_200_METERS,
            label: trans('sport.freestyle.200_meters'),
        },
        {
            value: FreestyleDistances.FREESTYLE_400_METERS,
            label: trans('sport.freestyle.400_meters'),
        },
        {
            value: FreestyleDistances.FREESTYLE_800_METERS,
            label: trans('sport.freestyle.800_meters'),
        },
        {
            value: FreestyleDistances.FREESTYLE_1500_METERS,
            label: trans('sport.freestyle.1500_meters'),
        },
    ],
    backstrokeDistances: [
        {
            value: BackstrokeDistances.BACKSTROKE_50_METERS,
            label: trans('sport.backstroke.50_meters'),
        },
        {
            value: BackstrokeDistances.BACKSTROKE_100_METERS,
            label: trans('sport.backstroke.100_meters'),
        },
        {
            value: BackstrokeDistances.BACKSTROKE_200_METERS,
            label: trans('sport.backstroke.200_meters'),
        },
    ],
    breaststrokeDistances: [
        {
            value: BreaststrokeDistances.BREASTSTROKE_50_METERS,
            label: trans('sport.breaststroke.50_meters'),
        },
        {
            value: BreaststrokeDistances.BREASTSTROKE_100_METERS,
            label: trans('sport.breaststroke.100_meters'),
        },
        {
            value: BreaststrokeDistances.BREASTSTROKE_200_METERS,
            label: trans('sport.breaststroke.200_meters'),
        },
    ],
    butterflyDistances: [
        {
            value: ButterflyDistances.BUTTERFLY_50_METERS,
            label: trans('sport.butterfly.50_meters'),
        },
        {
            value: ButterflyDistances.BUTTERFLY_100_METERS,
            label: trans('sport.butterfly.100_meters'),
        },
        {
            value: ButterflyDistances.BUTTERFLY_200_METERS,
            label: trans('sport.butterfly.200_meters'),
        },
    ],
    imDistances: [
        { value: IMDistances.IM_100_METERS, label: trans('sport.im.100_meters') },
        { value: IMDistances.IM_200_METERS, label: trans('sport.im.200_meters') },
        { value: IMDistances.IM_400_METERS, label: trans('sport.im.400_meters') },
    ],
    relayEvents: [
        {
            value: RelaySwimmingEventFields.FREESTYLE_RELAY,
            label: trans('sport.relayEvents.freestyleRelay'),
        },
        {
            value: RelaySwimmingEventFields.MEDLEY_RELAY,
            label: trans('sport.relayEvents.medleyRelay'),
        },
    ],
    openWaterSwimming: [
        {
            value: OpenWaterSwimmingEventFields.FIVE_KILOMETERS,
            label: trans('sport.openWaterSwimming.5_kilometers'),
        },
        {
            value: OpenWaterSwimmingEventFields.TEN_KILOMETERS,
            label: trans('sport.openWaterSwimming.10_kilometers'),
        },
        {
            value: OpenWaterSwimmingEventFields.TWENTY_FIVE_KILOMETERS,
            label: trans('sport.openWaterSwimming.25_kilometers'),
        },
    ],
    tennisSquad: [
        {
            value: TennisSquad.SINGLE,
            label: trans('sport.squad.single'),
        },
        {
            value: TennisSquad.DOUBLE,
            label: trans('sport.squad.double'),
        },
    ],
});
