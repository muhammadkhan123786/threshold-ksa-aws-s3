export const camelCaseToCapital = (text: string): string => {
    return text.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
        return str.toUpperCase();
    });
};

export const stringToDateString = (stringDate: string): string =>
    new Date(stringDate).toLocaleDateString();

export const getDateYearsFromNow = (
    years: number,
    months: number = 0,
    type: 'past' | 'future' = 'past',
): Date => {
    let currentDate = new Date();

    currentDate.setFullYear(
        type === 'past' ? currentDate.getFullYear() - years : currentDate.getFullYear() + years,
    );

    currentDate.setMonth(
        type === 'past' ? currentDate.getMonth() - months : currentDate.getMonth() + months,
    );

    return currentDate;
};
