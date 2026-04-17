import { useEffect, useState } from 'react';

export function useMediaQuery() {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        mediaQuery.addListener(handleMediaQueryChange);
        handleMediaQueryChange(mediaQuery);
        return () => {
            mediaQuery.removeListener(handleMediaQueryChange);
        };
    }, []);

    const handleMediaQueryChange = (mediaQuery: any) => {
        if (mediaQuery.matches) {
            setIsMobile(true);
            setIsTablet(false);
            setIsDesktop(false);
        } else {
            setIsMobile(false);
            setIsTablet(true);
            setIsDesktop(false);
        }
    };

    return {
        isMobile,
        isTablet,
        isDesktop,
    };
}
