import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

export function IsUUIDArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isUUIDArray",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value === null || value === undefined) return true; // Allow null or undefined
                    if (!Array.isArray(value)) return false;
                    return value.every(
                        (v) =>
                            typeof v === "string" &&
                            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
                                v
                            )
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be an array of valid UUIDs or null`;
                },
            },
        });
    };
}
