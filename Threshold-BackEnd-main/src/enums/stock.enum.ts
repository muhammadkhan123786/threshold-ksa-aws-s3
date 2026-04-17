import { SportProfileType } from "./athletes.enum";

export enum CategoryType {
    TSHIRT = "T-Shirt",
    PANTS = "Pants",
    SHOES = "Shoes",
    DRIFIT = "Dri-Fit",
    UNDERPANTS = "Underpants",
    BOXERS = "Boxers",
    SHORTS = "Shorts",
    SWIMSUIT = "Swimsuit",
    GOGGLES = "Goggles",
    SOCKS = "Socks",
    JACKET = "Jacket",
    HAT = "Hat",
    GLOVES = "Gloves",
    SKIRT = "Skirt",
    LEOTARD = "Leotard",
    UNIFORM = "Uniform",
    BELT = "Belt",
}

export enum ClothingSize {
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL",
    XXXL = "XXXL",
    CUSTOM = "Custom",
}

export enum ShoeSizeUS {
    US_8 = "US 8",
    US_8_5 = "US 8.5",
    US_9 = "US 9",
    US_9_5 = "US 9.5",
    US_10 = "US 10",
    US_10_5 = "US 10.5",
    US_11 = "US 11",
    US_11_5 = "US 11.5",
    US_12 = "US 12",
    US_12_5 = "US 12.5",
    US_13 = "US 13",
    US_13_5 = "US 13.5",
    US_14 = "US 14",
    US_14_5 = "US 14.5",
    US_15 = "US 15",
}

export enum ShoeSizeEU {
    EU_42 = "EU 42",
    EU_43 = "EU 43",
    EU_44 = "EU 44",
    EU_45 = "EU 45",
    EU_46 = "EU 46",
    EU_47 = "EU 47",
    EU_48 = "EU 48",
    EU_49 = "EU 49",
}

export enum ShoeSize {
    US_4 = "US 4",
    US_5 = "US 5",
    US_6 = "US 6",
    US_7 = "US 7",
    US_8 = "US 8",
    US_9 = "US 9",
    US_10 = "US 10",
    US_11 = "US 11",
    US_12 = "US 12",
    EU_36 = "EU 36",
    EU_37 = "EU 37",
    EU_38 = "EU 38",
    EU_39 = "EU 39",
    EU_40 = "EU 40",
    EU_41 = "EU 41",
    EU_42 = "EU 42",
    EU_43 = "EU 43",
    EU_44 = "EU 44",
    EU_45 = "EU 45",
    UK_4 = "UK 4",
    UK_5 = "UK 5",
    UK_6 = "UK 6",
    UK_7 = "UK 7",
    UK_8 = "UK 8",
    UK_9 = "UK 9",
    UK_10 = "UK 10",
    UK_11 = "UK 11",
    UK_12 = "UK 12",
    CUSTOM = "Custom",
}

export enum MeasurementUnit {
    US = "US",
    EU = "EU",
}

export const SPORT_CATEGORIES: Record<SportProfileType, CategoryType[]> = {
    [SportProfileType.FOOTBALL]: [
        CategoryType.TSHIRT,
        CategoryType.PANTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.BASKETBALL]: [
        CategoryType.TSHIRT,
        CategoryType.SHORTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.SWIMMING]: [
        CategoryType.SWIMSUIT,
        CategoryType.GOGGLES,
        CategoryType.SHOES,
    ],
    [SportProfileType.TENNIS]: [
        CategoryType.TSHIRT,
        CategoryType.SHORTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.HANDBALL]: [
        CategoryType.TSHIRT,
        CategoryType.SHORTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.NETBALL]: [
        CategoryType.TSHIRT,
        CategoryType.SKIRT,
        CategoryType.SHOES,
    ],
    [SportProfileType.VOLLEYBALL]: [
        CategoryType.TSHIRT,
        CategoryType.SHORTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.GYMNASTICS]: [CategoryType.LEOTARD, CategoryType.SHOES],
    [SportProfileType.ATHLETICS]: [
        CategoryType.TSHIRT,
        CategoryType.SHORTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.CRICKET]: [
        CategoryType.TSHIRT,
        CategoryType.PANTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.KARATE]: [CategoryType.UNIFORM, CategoryType.BELT],
    [SportProfileType.JUDO]: [CategoryType.UNIFORM, CategoryType.BELT],
    [SportProfileType.BOXING]: [CategoryType.SHORTS, CategoryType.GLOVES],
    [SportProfileType.MUAY]: [CategoryType.SHORTS, CategoryType.GLOVES],
    [SportProfileType.RUNNING]: [
        CategoryType.TSHIRT,
        CategoryType.SHORTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.TAEKWONDO]: [CategoryType.UNIFORM, CategoryType.BELT],
    [SportProfileType.PADEL]: [
        CategoryType.TSHIRT,
        CategoryType.SHORTS,
        CategoryType.SHOES,
    ],
    [SportProfileType.DEFAULT]: [], // Placeholder for undefined sports
};
