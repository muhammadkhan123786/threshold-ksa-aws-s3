export enum SportProfileFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    SPORT = "sport",
}

export enum FeedbackFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    NOTES = "notes",
    EMAIL = "email",
    NAME = "name",
}

export enum SessionRecordFields {
    STATUS = "status",
    COMMENT = "comment",
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    SCALE = "scale",
}

export enum SessionFields {
    STATUS = "status",
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    EXERTION = "exertion",
    TYPE = "type",
    DATE = "date",
    FROM = "from",
    TO = "to",
}

export enum TeamFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    LOGO = "logo",
    CREATION_DATE = "creationDate",
    SPORT = "sport",
    BRANCH = "branch",
    NAME = "name",
}

export enum CoachFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    AVATAR = "avatar",
    EXPERIENCE = "experience",
    BIRTHDAY = "birthday",
    PHONE = "phone",
    GENDER = "gender",
    SPORT = "sport",
    JOIN_DATE = "joinDate",
    LAST_NAME = "lastName",
    FIRST_NAME = "firstName",
}

export enum AthleteProfileFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    STATUS = "status",
    SPORT = "sport",
}

export enum AthleteBatteryFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    PACER = "pacer",
    SIT = "sit",
    TRUNK = "trunk",
    PUSH = "push",
    CURL = "curl",
    DATE = "date",
}

export enum AthleteBiometricFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    BMI = "bmi",
    BMI_PERCENTILE = "bmiPercentile",
    WEIGHT = "weight",
    HEIGHT = "height",
}

export enum AthleteFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    DATE_OF_UPDATING = "dateOfUpdating",
    JOIN_DATE = "joinDate",
    DATE_OF_BIRTH = "dateOfBirth",
    NIN = "nin",
    AVATAR = "avatar",
    LAST_NAME = "lastName",
    FIRST_NAME = "firstName",
}

export enum AcademyFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    CONTACT_NUMBER = "contactNumber",
    REGISTRATION_NUMBER = "registrationNumber",
    NAME = "name",
}

export enum UserFields {
    ID = "id",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    USERNAME = "username",
    EMAIL = "email",
    PHONE_NUMBER = "phoneNumber",
    ROLE = "role",
}

export enum TablesNames {
    SPORT_PROFILE = "sportProfile",
    FEEDBACK = "feedback",
    SESSION_RECORD = "sessionRecord",
    SESSION = "session",
    TEAM = "team",
    COACH = "coach",
    PROFILE_COLUMN = "profileColumn",
    ATHLETE_PROFILE = "athleteProfile",
    ATHLETE_BATTERY = "athleteBattery",
    ATHLETE_BIOMETRIC = "athleteBiometric",
    ATHLETE = "athlete",
    ACADEMY = "academy",
    USERS = "users",
}

export type AllTablesColumns =
    | SportProfileFields
    | FeedbackFields
    | SessionRecordFields
    | SessionFields
    | TeamFields
    | CoachFields
    | AthleteProfileFields
    | AthleteBatteryFields
    | AthleteBiometricFields
    | AthleteFields
    | AcademyFields
    | UserFields;
