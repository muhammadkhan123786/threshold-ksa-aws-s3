export enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
}

export enum Relationship {
    BROTHER = 'brother',
    FATHER = 'father',
    MOTHER = 'mother',
    WIFE = 'wife',
    SISTER = 'sister',
    FRIEND = 'friend',
    GRANDMOTHER = 'grandmother',
    GRANDFATHER = 'grandfather',
    MY_PHONE_NUMBER = 'my_phone_number',
}

export enum ClubRole {
    CLUB_EXECUTIVE_MANAGER = 'club-executive-manager',
    CLUB_TECHNICAL_DIRECTOR = 'club-technical-director',
    CLUB_SPORT_PROFILE_MANAGER = 'club-sport-profile-manager',
}
export enum Conditions {
    none = 'none',
    attention = 'attention',
    autistic = 'autistic',
    down_syndrome = 'down syndrome',
    hearing = 'hearing',
    physical_disability = 'physical disability',
    down = 'down',
    visual = 'visual',
    deaf = 'deaf',
    physical = 'physical',
    anxiety = 'anxiety',
    intellectual_disability = 'intellectual disability',
    adhd = 'adhd',
    dyslexia = 'dyslexia',
    epilepsy = 'epilepsy',
    depression = 'depression',
    bipolar_disorder = 'bipolar disorder',
    ptsd = 'ptsd',
    chronic_pain = 'chronic pain',
    learning_disability = 'learning disability',
    physical_injury = 'physical injury',
    asthma = 'asthma',
    diabetes = 'diabetes',
    heart_condition = 'heart condition',
    cancer = 'cancer',
    pregnancy = 'pregnancy',
    obesity = 'obesity',
    immune_disorder = 'immune disorder',
    sensory_processing_disorder = 'sensory processing disorder',
    other = 'other',
}

export enum EmploymentType {
    Permanent = 'Permanent',
    Temporary = 'Temporary',
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'Part-Time',
    Seasonal = 'Seasonal',
    Apprenticeship = 'Apprenticeship',
    Flexible = 'Flexible',
    Consultancy = 'Consultancy',
}
export enum SkillLevel {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Expert = 'Expert',
}
export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum YesNo {
    YES = 'yes',
    NO = 'no',
}

export enum Nationality {
    SA = 'sa',
    EG = 'eg',
    IQ = 'iq',
    AE = 'ae',
    DZ = 'dz',
    MA = 'ma',
    TN = 'tn',
    LY = 'ly',
    JO = 'jo',
    LB = 'lb',
    OM = 'om',
    QA = 'qa',
    BH = 'bh',
    KW = 'kw',
    YE = 'ye',
    SY = 'sy',
    PS = 'ps',
    SD = 'sd',
    MR = 'mr',
    KM = 'km',
    DJ = 'dj',
    SO = 'so',
    ER = 'er',
    ML = 'ml',
    TD = 'td',
    SAUDI_BORN = 'sb', // ولد في السعودية,
    NG = 'ng', // Nigeria
}
export enum Country {
    SAUDI_ARABIA = 'sa',
    EGYPT = 'eg',
    IRAQ = 'iq',
    UAE = 'ae',
    ALGERIA = 'dz',
    MOROCCO = 'ma',
    TUNISIA = 'tn',
    LIBYA = 'ly',
    JORDAN = 'jo',
    LEBANON = 'lb',
    OMAN = 'om',
    QATAR = 'qa',
    BAHRAIN = 'bh',
    KUWAIT = 'kw',
    YEMEN = 'ye',
    SYRIA = 'sy',
    PALESTINE = 'ps',
    SUDAN = 'sd',
    MAURITANIA = 'mr',
    COMOROS = 'km',
    DJIBOUTI = 'dj',
    SOMALIA = 'so',
    ERITREA = 'er',
    MALI = 'ml',
    CHAD = 'td',
    NIGERIA = 'ng',
}

export enum Education {
    // NON_DEGREE = 'non_degree',
    // HIGH_SCHOOL = 'high_school',
    // DIPLOMA = 'diploma',
    // BACHELORS = 'bachelors',
    // MASTERS = 'masters',
    // DOCTORATE = 'doctorate',
    KINDERGARTEN = 'kindergarten',
    PRIMARY = 'primary',
    INTERMEDIATE = 'intermediate',
    SECONDARY_SCHOOL = 'secondary_school',
    DIPLOMA = 'diploma',
    GRADUATE = 'graduate',
    POSTGRADUATE = 'postgraduate',
}

export enum AddAthletePublicEnum {
    CLUB_DOCUMENT = 'club_document',
    DOCUMENT = 'document',
}

export enum Consideration {
    NONE = 'none',
    ATTENTION = 'attention',
    AUTISTIC = 'autistic',
    DOWN = 'down',
    VISUAL = 'visual',
    DEAF = 'deaf',
    PHYSICAL = 'physical',
    ANXIETY = 'anxiety',
    INTELLECTUAL = 'intellectual',
}

export enum FoodAllergies {
    NONE = '--',
    PEANUTS = 'peanuts',
    TREE_NUTS = 'tree_nuts',
    MILK = 'milk',
    EGGS = 'eggs',
    WHEAT = 'wheat',
    SOY = 'soy',
    FISH = 'fish',
    SHELLFISH = 'shellfish',
    SESAME = 'sesame',
    GLUTEN = 'gluten',
    CORN = 'corn',
    BERRIES = 'berries',
    SOYBEANS = 'soybeans',
    MUSTARD = 'mustard',
    SULFITES = 'sulfites',
    CHOCOLATE = 'chocolate',
    CITRUS_FRUITS = 'citrus_fruits',
    STRAWBERRIES = 'strawberries',
    BANANAS = 'bananas',
    TOMATOES = 'tomatoes',
    GARLIC = 'garlic',
    ONIONS = 'onions',
    APPLES = 'apples',
    PEACHES = 'peaches',
    MUSHROOMS = 'mushrooms',
    ALCOHOL = 'alcohol',
    CAFFEINE = 'caffeine',
    ASPARTAME = 'aspartame',
    FOOD_COLORING = 'food_coloring',
    OTHER = 'other',
}
export enum AdministratorsType {
    CLUB_ADMIN_MANAGER = 'club-admin-manager',
    CLUB_ADMIN_ASSISTANT = 'club-admin-assistant',
}
export enum DocumentType {
    NATIONAL_ID = 'national_id',
    PASSPORT = 'passport',
    RESUME = 'resume',
    CERTIFICATE = 'certificate',
    DRIVER_LICENSE = 'driver_license',
    MEDICAL_REPORT = 'medical_report',
    CONTRACT = 'contract',
    VISA = 'visa',
    AMILY_CARD = 'family_card', // كرت عايله
    FATHER_NATIONAL_ID = 'father_national_id', // بطاقة احوال الوالد
    RESIDENCE_PERMIT = 'residence_permit', // اقامة
    SAUDI_BIRTH_CERTIFICATE = 'saudi_birth_certificate', // شهادة الميلاد سعوديين
    OTHER = 'other',
}

export enum SportProfileType {
    FOOTBALL = 'football',
    HANDBALL = 'handball',
    BASKETBALL = 'basketball',
    NETBALL = 'netball',
    VOLLEYBALL = 'volleyball',
    TENNIS = 'tennis',
    SWIMMING = 'swimming',
    GYMNASTICS = 'gymnastics',
    CRICKET = 'cricket',
    KARATE = 'karate',
    JUDO = 'judo',
    BOXING = 'boxing',
    MUAY = 'muay',
    ATHLETICS = 'athletics',
    TAEKWONDO = 'taekwondo',
    PADEL = 'padel',
    BEACH_VOLLEYBALL = 'beach_volleyball',
    PING_PONG = 'ping_pong',
    FENCING = 'fencing',
    WATER_POLO = 'water_polo',
    FUTSAL = 'futsal',
    EQUESTRIAN = 'equestrian',
    ARCHERY = 'archery',
}

export enum AthleteStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    NOT_AVAILABLE = 'not_available',
}

export enum HandStatus {
    LEFT = 'left',
    RIGHT = 'right',
    LEFT_RIGHT = 'left_right',
}

export enum PlayerPosition {
    GOALKEEPER = 'goalkeeper',
    DEFENDERS = 'defenders',
    CENTER_BACKS = 'center_backs',
    FULLBACKS = 'fullbacks',
    WINGBACKS = 'wingbacks',
    MIDFIELDERS = 'midfielders',
    CENTRAL_MIDFIELDERS = 'central_midfielders',
    ATTACKING_MIDFIELDERS = 'attacking_midfielders',
    DEFENSIVE_MIDFIELDERS = 'defensive_midfielders',
    FORWARDS = 'forwards',
    STRIKER_SECOND = 'strikers_second',
    STRIKERS = 'strikers',
}

export enum DefaultPosition {
    GOALKEEPER = 'goalkeeper',
    DEFENDERS = 'defenders',
    CENTER_BACKS = 'center_backs',
    FULLBACKS = 'fullbacks',
    WINGBACKS = 'wingbacks',
    MIDFIELDERS = 'midfielders',
    CENTRAL_MIDFIELDERS = 'central_midfielders',
    ATTACKING_MIDFIELDERS = 'attacking_midfielders',
    DEFENSIVE_MIDFIELDERS = 'defensive_midfielders',
    FORWARDS = 'forwards',
    STRIKER_SECOND = 'strikers_second',
    STRIKERS = 'strikers',
    POINT_GUARD = 'basketball_point_guard',
    SHOOTING_GUARD = 'basketball_shooting_guard',
    SMALL_FORWARD = 'basketball_small_forward',
    POWER_FORWARD = 'basketball_power_forward',
    CENTER = 'center',
    WING = 'handball_wing',
    BACK = 'handball_back',
    PIVOT = 'handball_pivot',
    GOAL_SHOOTER = 'netball_goal_shooter',
    GOAL_ATTACK = 'netball_goal_attack',
    WING_ATTACK = 'netball_wing_attack',
    WING_DEFENCE = 'netball_wing_defence',
    GOAL_DEFENCE = 'netball_goal_defence',
    GOAL_KEEPER = 'netball_goal_keeper',
}

export enum BasketballPlayerPosition {
    POINT_GUARD = 'basketball_point_guard',
    SHOOTING_GUARD = 'basketball_shooting_guard',
    SMALL_FORWARD = 'basketball_small_forward',
    POWER_FORWARD = 'basketball_power_forward',
    CENTER = 'center',
}

export enum HandballPlayerPosition {
    GOALKEEPER = 'goalkeeper',
    WING = 'handball_wing',
    BACK = 'handball_back',
    PIVOT = 'handball_pivot',
}

export enum NetballPlayerPosition {
    GOAL_SHOOTER = 'netball_goal_shooter',
    GOAL_ATTACK = 'netball_goal_attack',
    WING_ATTACK = 'netball_wing_attack',
    CENTER = 'center',
    WING_DEFENCE = 'netball_wing_defence',
    GOAL_DEFENCE = 'netball_goal_defence',
    GOAL_KEEPER = 'netball_goal_keeper',
}

export enum AthleteBiometricStatus {
    OVER_WEIGHT = 'over_weight',
    UNDER_WEIGHT = 'under_weight',
    HEALTHY = 'healthy',
    OBESE = 'obese',
}

export enum ProfileColumnName {
    FOOT = 'foot',
    HAND = 'hand',
    TEAM = 'team',
    POSITION = 'position',
}

export enum PlayingSessionType {
    TRAINING = 'training',
    MATCH = 'match',
    EXAM = 'exam',
}

export enum SessionDayPeriod {
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
}

export enum SessionRecordStatus {
    ABSENT = 'absent',
    PRESENT = 'present',
    REASON = 'reason',
    INJURY = 'injury',
}

export enum PlayingSessionStatus {
    NOT_STARTED = 'not_started',
    STARTED = 'started',
    PREPARATION_COMPLETE = 'preparation_complete',
    DONE = 'done',
}

export enum TrackEventsOptions {
    SPRINTS = 'sprints',
    MIDDLE_DISTANCE = 'middle_distance',
    LONG_DISTANCE = 'long_distance',
    HURDLES = 'hurdles',
    RELAYS = 'relays',
    STEEPLECHASE = 'steeplechase',
}

export enum FieldEventsOptions {
    JUMPS = 'jumps',
    THROWS = 'throws',
}

export enum CombinedEventsOptions {
    HEPTATHLON = 'heptathlon',
    DECATHLON = 'decathlon',
}

export enum HeptathlonOptions {
    HEPTATHLON = 'heptathlon',
}

export enum DecathlonOptions {
    DECATHLON = 'decathlon',
}

export enum RoadRunningEventsOptions {
    FIVE_KILOMETERS = '5_kilometers',
    TEN_KILOMETERS = '10_kilometers',
    HALF_MARATHON = 'half_marathon',
    MARATHON = 'marathon',
}

export enum SprintOptions {
    ONE_HUNDRED_METERS = '100_meters',
    TWO_HUNDRED_METERS = '200_meters',
    FOUR_HUNDRED_METERS = '400_meters',
}

export enum MiddleDistanceOptions {
    EIGHT_HUNDRED_METERS = '800_meters',
    FIFTEEN_HUNDRED_METERS = '1500_meters',
}

export enum LongDistanceOptions {
    FIVE_THOUSAND_METERS = '5000_meters',
    TEN_THOUSAND_METERS = '10000_meters',
}

export enum HurdlesOptions {
    ONE_HUNDRED_METERS_HURDLES = '100_meters_hurdles',
    ONE_HUNDRED_TEN_METERS_HURDLES = '110_meters_hurdles',
    FOUR_HUNDRED_METERS_HURDLES = '400_meters_hurdles',
}

export enum RelayOptions {
    FOUR_BY_ONE_HUNDRED_METERS_RELAY = '4x100_meters_relay',
    FOUR_BY_FOUR_HUNDRED_METERS_RELAY = '4x400_meters_relay',
}

export enum SteeplechaseOptions {
    THREE_THOUSAND_METERS_STEEPLECHASE = '3000_meters_steeplechase',
}

export enum JumpsOptions {
    LONG_JUMP = 'long_jump',
    TRIPLE_JUMP = 'triple_jump',
    HIGH_JUMP = 'high_jump',
    POLE_VAULT = 'pole_vault',
}

export enum ThrowsOptions {
    SHOT_PUT = 'shot_put',
    DISCUS_THROW = 'discus_throw',
    JAVELIN_THROW = 'javelin_throw',
    HAMMER_THROW = 'hammer_throw',
}

export enum EventType {
    TRACK_EVENTS = 'trackEvents',
    FIELD_EVENTS = 'fieldEvents',
    COMBINED_EVENTS = 'combinedEvents',
    ROAD_RUNNING_EVENTS = 'roadRunningEvents',
    INDIVIDUAL_EVENTS = 'individualEvents',
    RELAY_EVENTS = 'relayEvents',
    OPEN_WATER_SWIMMING = 'openWaterSwimming',
}

export enum AthleticsEventType {
    TRACK_EVENTS = 'trackEvents',
    FIELD_EVENTS = 'fieldEvents',
    COMBINED_EVENTS = 'combinedEvents',
    ROAD_RUNNING_EVENTS = 'roadRunningEvents',
}

export enum SubscriptionPeriod {
    // FIFTEEN_DAYS = '15_days',
    ONE_MONTH = '1_month',
    TWO_MONTHS = '2_months',
    THREE_MONTHS = '3_months',
    SIX_MONTHS = '6_months',
    ONE_YEAR = '1_year',
    TWO_YEARS = '2_years',
    THREE_YEARS = '3_years',
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    EXPIRED = 'expired',
}

export enum PaymentMethod {
    CASH = 'cash',
    ONLINE = 'online',
}

export enum SwimmingEventType {
    INDIVIDUAL_EVENTS = 'individualEvents',
    RELAY_EVENTS = 'relayEvents',
    OPEN_WATER_SWIMMING = 'openWaterSwimming',
}

export enum IndividualSwimmingEventFields {
    FREESTYLE = 'freestyle',
    BACKSTROKE = 'backstroke',
    BREASTSTROKE = 'breaststroke',
    BUTTERFLY = 'butterfly',
    IM = 'individualMedley',
}

export enum AthleteLevel {
    ASH = 'ASH',
    SHB = 'SHB',
    BRM = 'BRM',
    DF3 = 'DF3',
}

export enum FreestyleDistances {
    FREESTYLE_50_METERS = '50_meters',
    FREESTYLE_100_METERS = '100_meters',
    FREESTYLE_200_METERS = '200_meters',
    FREESTYLE_400_METERS = '400_meters',
    FREESTYLE_800_METERS = '800_meters',
    FREESTYLE_1500_METERS = '1500_meters',
}

export enum BackstrokeDistances {
    BACKSTROKE_50_METERS = '50_meters',
    BACKSTROKE_100_METERS = '100_meters',
    BACKSTROKE_200_METERS = '200_meters',
}

export enum BreaststrokeDistances {
    BREASTSTROKE_50_METERS = '50_meters',
    BREASTSTROKE_100_METERS = '100_meters',
    BREASTSTROKE_200_METERS = '200_meters',
}

export enum ButterflyDistances {
    BUTTERFLY_50_METERS = '50_meters',
    BUTTERFLY_100_METERS = '100_meters',
    BUTTERFLY_200_METERS = '200_meters',
}

export enum IMDistances {
    IM_100_METERS = '50_meters',
    IM_200_METERS = '100_meters',
    IM_400_METERS = '200_meters',
}

export enum RelaySwimmingEventFields {
    FREESTYLE_RELAY = 'freestyleRelay',
    MEDLEY_RELAY = 'medleyRelay',
}

export enum OpenWaterSwimmingEventFields {
    FIVE_KILOMETERS = '5_kilometers',
    TEN_KILOMETERS = '10_kilometers',
    TWENTY_FIVE_KILOMETERS = '25_kilometers',
}

export enum SwimmingIndividualEvents {
    FREESTYLE_50_METERS = '50_meters',
    FREESTYLE_100_METERS = '100_meters',
    FREESTYLE_200_METERS = '200_meters',
    FREESTYLE_400_METERS = '400_meters',
    FREESTYLE_800_METERS = '800_meters',
    FREESTYLE_1500_METERS = '1500_meters',
    BACKSTROKE_50_METERS = '50_meters',
    BACKSTROKE_100_METERS = '100_meters',
    BACKSTROKE_200_METERS = '200_meters',
    BREASTSTROKE_50_METERS = '50_meters',
    BREASTSTROKE_100_METERS = '100_meters',
    BREASTSTROKE_200_METERS = '200_meters',
    BUTTERFLY_50_METERS = '50_meters',
    BUTTERFLY_100_METERS = '100_meters',
    BUTTERFLY_200_METERS = '200_meters',
    IM_100_METERS = '00_meters',
    IM_200_METERS = '200_meters',
    IM_400_METERS = '400_meters',
}

export enum SwimmingRelayEvents {
    FREESTYLE_RELAY_4X100_METERS = '4x100_meters',
    FREESTYLE_RELAY_4X200_METERS = '4x200_meters',
    MEDLEY_RELAY_4X100_METERS = '4x100_meters',
}

export enum SwimmingOpenWaterEvents {
    OPEN_WATER_5_KILOMETERS = '5_kilometers',
    OPEN_WATER_10_KILOMETERS = '10_kilometers',
    OPEN_WATER_25_KILOMETERS = '25_kilometers',
}

export enum TennisSquad {
    SINGLE = 'single',
    DOUBLE = 'double',
}
export enum ClothingSize {
    XS = 'xs',
    S = 's',
    M = 'm',
    L = 'l',
    XL = 'xl',
    XXL = 'xxl',
}
// export const ShoeSizes = Array.from({ length: 50 - 35 + 1 }, (_, i) => 35 + i);
export enum ShoeSizes {
    Size35 = '35',
    Size36 = '36',
    Size37 = '37',
    Size38 = '38',
    Size39 = '39',
    Size40 = '40',
    Size41 = '41',
    Size42 = '42',
    Size43 = '43',
    Size44 = '44',
    Size45 = '45',
    Size46 = '46',
    Size47 = '47',
    Size48 = '48',
    Size49 = '49',
    Size50 = '50',
}
export enum AgeGroups {
    Age5to9 = '5-9',
    Age10to14 = '10-14',
    Age15to19 = '15-19',
    Age20to24 = '20-24',
    Age25to29 = '25-29',
    Age30to34 = '30-34',
    Age35to39 = '35-39',
}
export enum CreateEventType {
    HOLIDAY = 'holiday',
    FINISHED_CONTRACT = 'finished_contract',
    SESSIONS = 'sessions',
    MATCHES = 'matches',
}
