import { Transform } from "class-transformer";

export const passwordGenerator = (length = 12) => {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
};

export const camelCaseToSnakeCase = (word: string) =>
    word.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();

export const getMarketingEmail = (email: string): string => {
    const parts = email.split("@");

    if (!parts[1].endsWith(".com")) return email;

    parts[1] = parts[1].replace(/\.com$/, ".marketing.com");

    return parts.join("@");
};

function createDefaultObject(entityClass: any): any {
    const instance = new entityClass();
    const defaultObj: any = {};

    Object.keys(instance).forEach((key) => {
        defaultObj[key] = "N/A";
    });

    return defaultObj;
}

export function FirstArrayItemOrDefault(entityClass: any) {
    return Transform(({ value }) =>
        Array.isArray(value) && value.length > 0
            ? value[0]
            : createDefaultObject(entityClass)
    );
}
