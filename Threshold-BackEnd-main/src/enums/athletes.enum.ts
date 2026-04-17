export enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
}

export enum Relationship {
    BROTHER = "brother",
    FATHER = "father",
    MOTHER = "mother",
    WIFE = "wife",
    SISTER = "sister",
    FRIEND = "friend",
    GRANDMOTHER = "grandmother",
    GRANDFATHER = "grandfather",
    MY_PHONE_NUMBER = "my_phone_number",
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
}

export enum YesNo {
    YES = "yes",
    NO = "no",
}

export enum Nationality {
    SA = "sa",
    EG = "eg",
    IQ = "iq",
    AE = "ae",
    DZ = "dz",
    MA = "ma",
    TN = "tn",
    LY = "ly",
    JO = "jo",
    LB = "lb",
    OM = "om",
    QA = "qa",
    BH = "bh",
    KW = "kw",
    YE = "ye",
    SY = "sy",
    PS = "ps",
    SD = "sd",
    MR = "mr",
    KM = "km",
    DJ = "dj",
    SO = "so",
    ER = "er",
    ML = "ml",
    TD = "td",
    SAUDI_BORN = "sb", // ولد في السعودية,
    NG = "ng", // Nigeria
}

export enum Education {
    // NON_DEGREE = "non_degree",
    // HIGH_SCHOOL = "high_school",
    // DIPLOMA = "diploma",
    // BACHELORS = "bachelors",
    // MASTERS = "masters",
    // DOCTORATE = "doctorate",
    KINDERGARTEN = "kindergarten",
    PRIMARY = "primary",
    INTERMEDIATE = "intermediate",
    SECONDARY_SCHOOL = "secondary_school",
    DIPLOMA = "diploma",
    GRADUATE = "graduate",
    POSTGRADUATE = "postgraduate",
}

export enum Consideration {
    NONE = "none",
    ATTENTION = "attention",
    AUTISTIC = "autistic",
    DOWN_SYNDROME = "down_syndrome",
    HEARING_IMPAIRMENT = "hearing",
    PHYSICAL_DISABILITY = "physical_disability",
    DOWN = "down",
    VISUAL = "visual",
    DEAF = "deaf",
    PHYSICAL = "physical",
    ANXIETY = "anxiety",
    INTELLECTUAL_DISABILITY = "intellectual_disability",
    ADHD = "adhd",
    DYSLEXIA = "dyslexia",
    EPILEPSY = "epilepsy",
    DEPRESSION = "depression",
    BIPOLAR_DISORDER = "bipolar_disorder",
    PTSD = "ptsd",
    CHRONIC_PAIN = "chronic_pain",
    LEARNING_DISABILITY = "learning_disability",
    PHYSICAL_INJURY = "physical_injury",
    ASTHMA = "asthma",
    DIABETES = "diabetes",
    HEART_CONDITION = "heart_condition",
    CANCER = "cancer",
    PREGNANCY = "pregnancy",
    OBESITY = "obesity",
    IMMUNE_DISORDER = "immune_disorder",
    SENSORY_PROCESSING_DISORDER = "sensory_processing_disorder",
    OTHER = "other",
}

export enum SportProfileType {
    FOOTBALL = "football",
    HANDBALL = "handball",
    NETBALL = "netball",
    BASKETBALL = "basketball",
    VOLLEYBALL = "volleyball",
    TENNIS = "tennis",
    SWIMMING = "swimming",
    GYMNASTICS = "gymnastics",
    CRICKET = "cricket",
    KARATE = "karate",
    JUDO = "judo",
    BOXING = "boxing",
    MUAY = "muay",
    RUNNING = "running",
    ATHLETICS = "athletics",
    TAEKWONDO = "taekwondo",
    PADEL = "padel",
    DEFAULT = "DEFAULT",
}

export enum ProfileStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    NOT_AVAILABLE = "not_available",
}

export enum AthleteBiometricStatus {
    OVER_WEIGHT = "over_weight",
    UNDER_WEIGHT = "under_weight",
    HEALTHY = "healthy",
    OBESE = "obese",
}

export enum ProfileColumnName {
    FOOT = "foot",
    HAND = "hand",
    TEAM = "team",
    POSITION = "position",
}

export enum SkillLevel {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Expert = "Expert",
}

export enum PlayingSessionType {
    TRAINING = "training",
    MATCH = "match",
    EXAM = "exam",
}

export enum SessionRecordStatus {
    ABSENT = "absent",
    PRESENT = "present",
    REASON = "reason",
    INJURY = "injury",
    PLAYING_WITH_NATIONAL_TEAM = "playing_with_national_team",
}

export enum PlayingSessionStatus {
    NOT_STARTED = "not_started",
    STARTED = "started",
    PREPARATION_COMPLETE = "preparation_complete",
    DONE = "done",
}

export enum TrackEventsOptions {
    SPRINTS = "sprints",
    MIDDLE_DISTANCE = "middle_distance",
    LONG_DISTANCE = "long_distance",
    HURDLES = "hurdles",
    RELAYS = "relays",
    STEEPLECHASE = "steeplechase",
}

export enum FieldEventsOptions {
    JUMPS = "jumps",
    THROWS = "throws",
}

export enum CombinedEventsOptions {
    HEPTATHLON = "heptathlon",
    DECATHLON = "decathlon",
}

export enum HeptathlonOptions {
    HUNDRED_METERS_HURDLES = "100_meters_hurdles",
    HIGH_JUMP = "high_jump",
    SHOT_PUT = "shot_put",
    TWO_HUNDRED_METERS = "200_meters",
    LONG_JUMP = "long_jump",
    JAVELIN_THROW = "javelin_throw",
    EIGHT_HUNDRED_METERS = "800_meters",
}

export enum DecathlonOptions {
    HUNDRED_METERS = "100_meters",
    LONG_JUMP = "long_jump",
    SHOT_PUT = "shot_put",
    HIGH_JUMP = "high_jump",
    FOUR_HUNDRED_METERS = "400_meters",
    HUNDRED_TEN_METERS_HURDLES = "110_meters_hurdles",
    DISCUS_THROW = "discus_throw",
    POLE_VAULT = "pole_vault",
    JAVELIN_THROW = "javelin_throw",
    FIFTEEN_HUNDRED_METERS = "1500_meters",
}

export enum RoadRunningEventsOptions {
    FIVE_KILOMETERS = "5_kilometers",
    TEN_KILOMETERS = "10_kilometers",
    HALF_MARATHON = "half_marathon",
    MARATHON = "marathon",
}

export enum SprintOptions {
    ONE_HUNDRED_METERS = "100_meters",
    TWO_HUNDRED_METERS = "200_meters",
    FOUR_HUNDRED_METERS = "400_meters",
}

export enum MiddleDistanceOptions {
    EIGHT_HUNDRED_METERS = "800_meters",
    FIFTEEN_HUNDRED_METERS = "1500_meters",
}

export enum LongDistanceOptions {
    FIVE_THOUSAND_METERS = "5000_meters",
    TEN_THOUSAND_METERS = "10000_meters",
}

export enum PlayerPosition {
    GOALKEEPER = "goalkeeper",
    DEFENDERS = "defenders",
    CENTER_BACKS = "center_backs",
    FULLBACKS = "fullbacks",
    WINGBACKS = "wingbacks",
    MIDFIELDERS = "midfielders",
    CENTRAL_MIDFIELDERS = "central_midfielders",
    ATTACKING_MIDFIELDERS = "attacking_midfielders",
    DEFENSIVE_MIDFIELDERS = "defensive_midfielders",
    FORWARDS = "forwards",
    STRIKER_SECOND = "strikers_second",
    STRIKERS = "strikers",
    POINT_GUARD = "basketball_point_guard",
    SHOOTING_GUARD = "basketball_shooting_guard",
    SMALL_FORWARD = "basketball_small_forward",
    POWER_FORWARD = "basketball_power_forward",
    CENTER = "center",
    WING = "handball_wing",
    BACK = "handball_back",
    PIVOT = "handball_pivot",
    GOAL_SHOOTER = "netball_goal_shooter",
    GOAL_ATTACK = "netball_goal_attack",
    WING_ATTACK = "netball_wing_attack",
    WING_DEFENCE = "netball_wing_defence",
    GOAL_DEFENCE = "netball_goal_defence",
    GOAL_KEEPER = "netball_goal_keeper",
}

export enum HandStatus {
    LEFT = "left",
    RIGHT = "right",
    LEFT_RIGHT = "left_right",
}

export enum HurdlesOptions {
    ONE_HUNDRED_METERS_HURDLES = "100_meters_hurdles",
    ONE_HUNDRED_TEN_METERS_HURDLES = "110_meters_hurdles",
    FOUR_HUNDRED_METERS_HURDLES = "400_meters_hurdles",
}

export enum RelayOptions {
    FOUR_BY_ONE_HUNDRED_METERS_RELAY = "4x100_meters_relay",
    FOUR_BY_FOUR_HUNDRED_METERS_RELAY = "4x400_meters_relay",
}

export enum SteeplechaseOptions {
    THREE_THOUSAND_METERS_STEEPLECHASE = "3000_meters_steeplechase",
}

export enum JumpsOptions {
    LONG_JUMP = "long_jump",
    TRIPLE_JUMP = "triple_jump",
    HIGH_JUMP = "high_jump",
    POLE_VAULT = "pole_vault",
}

export enum ThrowsOptions {
    SHOT_PUT = "shot_put",
    DISCUS_THROW = "discus_throw",
    JAVELIN_THROW = "javelin_throw",
    HAMMER_THROW = "hammer_throw",
}

export enum EventType {
    TRACK_EVENTS = "trackEvents",
    FIELD_EVENTS = "fieldEvents",
    COMBINED_EVENTS = "combinedEvents",
    ROAD_RUNNING_EVENTS = "roadRunningEvents",
    INDIVIDUAL_EVENTS = "individualEvents",
    RELAY_EVENTS = "relayEvents",
    OPEN_WATER_SWIMMING = "openWaterSwimming",
}

export enum SwimmingIndividualEvents {
    FIFTY_METERS = "50_meters",
    HUNDRED_METERS = "100_meters",
    TWO_HUNDRED_METERS = "200_meters",
    FOUR_HUNDRED_METERS = "400_meters",
    EIGHT_HUNDRED_METERS = "800_meters",
    FIFTEEN_HUNDRED_METERS = "1500_meters",
    HUNDRED_METERS_SHORT_COURSE = "100_meters_short_course",
}

export enum SwimmingRelayEvents {
    FOUR_BY_HUNDRED_METERS_FREESTYLE = "4x100_meters_freestyle",
    FOUR_BY_TWO_HUNDRED_METERS_FREESTYLE = "4x200_meters_freestyle",
    FOUR_BY_HUNDRED_METERS_MEDLEY = "4x100_meters_medley",
}

export enum SwimmingOpenWaterEvents {
    FIVE_KILOMETERS = "5_kilometers",
    TEN_KILOMETERS = "10_kilometers",
    TWENTY_FIVE_KILOMETERS = "25_kilometers",
}

export enum TennisSquad {
    SINGLE = "single",
    DOUBLE = "double",
}

export enum AthleteLevel {
    BARAEM = "BRM", // جة براعم
    ASHBAAL = "ASH", // درجة أشبال
    NASHIEEN = "NSH", // درجة ناشئين
    SHABAB = "SHB", // درجة شباب
    AWAL = "AWL", // درجة أولى (formerly محترف)
}

export enum AvailabilityStatus {
    injured = "injured",
    national_team = "national_team",
    available = "available",
}

export const ChronicDiseases = [
    "coronary_artery_disease",
    "hypertension",
    "copd",
    "asthma",
    "interstitial_lung_disease",
    "type_1_diabetes",
    "type_2_diabetes",
    "alzheimers_disease",
    "parkinsons_disease",
    "multiple_sclerosis",
    "rheumatoid_arthritis",
    "lupus",
    "chronic_kidney_disease",
    "ibd",
    "ibs",
    "depression",
    "anxiety_disorders",
    "bipolar_disorder",
    "osteoporosis",
    "obesity",
];

export enum FoodAllergies {
    PEANUTS = "peanuts",
    TREE_NUTS = "tree_nuts",
    MILK = "milk",
    EGGS = "eggs",
    WHEAT = "wheat",
    SOY = "soy",
    FISH = "fish",
    SHELLFISH = "shellfish",
    SESAME = "sesame",
    GLUTEN = "gluten",
    CORN = "corn",
    BERRIES = "berries",
    SOYBEANS = "soybeans",
    MUSTARD = "mustard",
    SULFITES = "sulfites",
    CHOCOLATE = "chocolate",
    CITRUS_FRUITS = "citrus_fruits",
    STRAWBERRIES = "strawberries",
    BANANAS = "bananas",
    TOMATOES = "tomatoes",
    GARLIC = "garlic",
    ONIONS = "onions",
    APPLES = "apples",
    PEACHES = "peaches",
    MUSHROOMS = "mushrooms",
    ALCOHOL = "alcohol",
    CAFFEINE = "caffeine",
    ASPARTAME = "aspartame",
    FOOD_COLORING = "food_coloring",
    OTHER = "other",
}

export enum TestTypeEnum {
    PUSH = "push",
    CURL = "curl",
    TRUNK = "trunk",
    SIT = "sit",
    PACER = "pacer",
    ALL = "all",
}

export enum IntervalEnum {
    FIFTEEN_DAYS = "15 days",
    ONE_MONTH = "1 month",
    DAILY = "1 day",
}

export enum AthleteClothingStatus {
    NEEDS = "needs",
    NOT_DELIVERED = "not-delivered",
    ALL_IS_GOOD = "all-is-good",
}
