export const generatePrefixedId = (prefix: string) => {
    const randomNum = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0");
    return `${prefix}-${randomNum}`;
};

export const PrefixedIdGenerator = (prefix: string) => ({
    name: `${prefix}IdGenerator`,
    strategy: "increment",
    generate: () => generatePrefixedId(prefix),
});
