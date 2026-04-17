import {
    DecathlonOptions,
    EventType,
    HeptathlonOptions,
    HurdlesOptions,
    IndividualSwimmingEventFields,
    JumpsOptions,
    LongDistanceOptions,
    MiddleDistanceOptions,
    PlayerPosition,
    RelayOptions,
    RoadRunningEventsOptions,
    SprintOptions,
    SteeplechaseOptions,
    SubscriptionPeriod,
    SubscriptionStatus,
    SwimmingEventType,
    SwimmingIndividualEvents,
    SwimmingOpenWaterEvents,
    SwimmingRelayEvents,
    TennisSquad,
    ThrowsOptions,
} from './../enums/athlete';
import {
    Gender,
    YesNo,
    Education,
    Consideration,
    SportProfileType,
    AthleteStatus,
} from 'libs/enums';
import { AthleteBiometricStatus, HandStatus, Nationality, Relationship } from 'libs/enums/athlete';
import { Team } from './team';

export type Sport =
    | 'football'
    | 'handball'
    | 'basketball'
    | 'volleyball'
    | 'tennis'
    | 'swimming'
    | 'gymnastics'
    | 'cricket'
    | 'karate'
    | 'judo'
    | 'boxing'
    | 'muay'
    | 'running';

export const MAX_FILE_SIZE = 2 * 1024 * 1024;

export type Athlete = {
    [x: string]: any;
    experience: any;
    category: any;
    id: string;
    createdAt: string;
    updatedAt: string;
    allergies: YesNo;
    avatar: string;
    chronic: string[];
    consideration: Consideration;
    nationality: Nationality;
    dateOfBirth: string;
    dateOfUpdating: string;
    education: Education;
    firstName: string;
    lastName: string;
    gender: Gender;
    injury: YesNo;
    joinDate: string;
    nin: string;
    relationship: Relationship;
    contactNumber: number;
    teams?: Team[];
    athleteProfiles: AthleteProfile[];
    subscriptionStatus?: SubscriptionStatus;
    subscription: any;
};

export type AthleteBiometric = {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    weight: string;
    height: string;
    bmi: string;
    bmiPercentile: string;
    status: AthleteBiometricStatus;
};

export type AthleteFitnessBattery = {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    curl: string;
    push: string;
    trunk: string;
    sit: string;
    pacer: string;
};
export type AthleteProfile = {
    id: string;
    createdAt: string;
    updatedAt: string;
    eventType: EventType;
    swimmingEventType: SwimmingEventType;
    sport: SportProfileType;
    status: AthleteStatus;
    hand: HandStatus;
    foot: HandStatus;
    position: PlayerPosition;
    sprint?: SprintOptions[];
    middleDistance?: MiddleDistanceOptions[];
    longDistance?: LongDistanceOptions[];
    hurdles?: HurdlesOptions[];
    relay?: RelayOptions[];
    steeplechase?: SteeplechaseOptions[];
    jumps?: JumpsOptions[];
    throws?: ThrowsOptions[];
    heptathlon?: HeptathlonOptions[];
    decathlon?: DecathlonOptions[];
    five_kilometers?: RoadRunningEventsOptions[];
    ten_kilometers?: RoadRunningEventsOptions[];
    half_marathon?: RoadRunningEventsOptions[];
    marathon?: RoadRunningEventsOptions[];
    freestyle?: IndividualSwimmingEventFields[];
    backstroke?: SwimmingIndividualEvents[];
    breaststroke?: SwimmingIndividualEvents[];
    butterfly?: SwimmingIndividualEvents[];
    im?: SwimmingIndividualEvents[];
    freestyleRelay?: SwimmingRelayEvents[];
    medleyRelay?: SwimmingRelayEvents[];
    openWaterSwimming?: SwimmingOpenWaterEvents[];
    squad?: TennisSquad[];
};
export interface AthleteSubscription {
    id: string;
    athleteId: string;
    subscriptionDate: Date;
    status: SubscriptionStatus;
    period: SubscriptionPeriod;
    expiryDate: Date;
}

export interface AthleteRecord {
    id: string;
    category: string;
    subcategory: string;
    personalRecord: number;
    bestRecord: number;
    lastRecord: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface AthletesRecords {
    records: AthleteRecord[];
}
