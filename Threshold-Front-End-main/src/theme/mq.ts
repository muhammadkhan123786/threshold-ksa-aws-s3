const breakpoints = {
    mobile: 320,
    tablet: 768,
    laptop: 1024,
    desktop: 2560,
};

export const mq = {
    mobile: `(min-width: ${breakpoints.mobile}px)`,
    tablet: `(min-width: ${breakpoints.tablet}px)`,
    laptop: `(min-width: ${breakpoints.laptop}px)`,
    desktop: `(min-width: ${breakpoints.desktop}px)`,
};
