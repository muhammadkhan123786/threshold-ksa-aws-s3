type RelationsListing = {
    oneToMany: string[];
    manyToOne: string[];
    manyToMany: string[];
};

export const RELATIONS: {
    feedback: RelationsListing;
    coach: RelationsListing;
    academy: RelationsListing;
    athlete: RelationsListing;
    user: RelationsListing;
    team: RelationsListing;
    session: RelationsListing;
    athleteProfile: RelationsListing;
    profileColumn: RelationsListing;
    athleteBattery: RelationsListing;
    athleteBiometric: RelationsListing;
    sessionRecord: RelationsListing;
    sportProfile: RelationsListing;
} = {
    feedback: {
        oneToMany: [],
        manyToOne: ["academy"],
        manyToMany: [],
    },
    sportProfile: {
        oneToMany: [],
        manyToOne: ["academy"],
        manyToMany: [],
    },
    coach: {
        oneToMany: ["teams"],
        manyToOne: ["academy"],
        manyToMany: [],
    },
    session: {
        oneToMany: ["sessionRecords"],
        manyToOne: ["academy", "team"],
        manyToMany: [],
    },
    sessionRecord: {
        oneToMany: [],
        manyToOne: ["session", "athlete"],
        manyToMany: [],
    },
    academy: {
        oneToMany: [
            "teams",
            "coaches",
            "athleteProfiles",
            "sportProfiles",
            "athletes",
            "sessions",
            "feedbacks",
            "users",
        ],
        manyToOne: [],
        manyToMany: [],
    },
    athlete: {
        oneToMany: [
            "athleteProfiles",
            "athleteBatteries",
            "athleteBiometrics",
            "sessionRecords",
        ],
        manyToOne: ["academy"],
        manyToMany: ["teams", "sessions"],
    },
    team: {
        oneToMany: [],
        manyToOne: ["academy", "coach"],
        manyToMany: ["athletes"],
    },
    athleteProfile: {
        oneToMany: ["profileColumns"],
        manyToOne: ["academy", "athlete"],
        manyToMany: [],
    },
    profileColumn: {
        oneToMany: [],
        manyToOne: ["athleteProfile"],
        manyToMany: [],
    },
    athleteBattery: {
        oneToMany: [],
        manyToOne: ["athlete"],
        manyToMany: [],
    },
    athleteBiometric: {
        oneToMany: [],
        manyToOne: ["athlete"],
        manyToMany: [],
    },
    user: { oneToMany: [], manyToOne: ["academy"], manyToMany: [] },
};
