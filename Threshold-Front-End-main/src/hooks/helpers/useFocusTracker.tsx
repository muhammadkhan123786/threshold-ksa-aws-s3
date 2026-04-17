import { useRef, useEffect } from 'react';

type FocusableElement = HTMLInputElement | HTMLTextAreaElement;

export const useFocusTracker = (initialRef?: FocusableElement | null) => {
    const ref = useRef<FocusableElement>(initialRef || null);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Tab') {
                // Tab key
                const currentElement = document.activeElement as FocusableElement;
                // Logic for handling focus change based on shiftKey
                if (event.shiftKey) {
                    // Backwards tab
                    const previousElement =
                        currentElement.previousElementSibling as FocusableElement;
                    if (previousElement && previousElement.tagName !== 'BUTTON') {
                        // Avoid buttons
                        previousElement.focus();
                    }
                } else {
                    // Forward tab
                    const nextElement = currentElement.nextElementSibling as FocusableElement;
                    if (nextElement) {
                        nextElement.focus();
                    }
                }
            }
        };

        ref.current?.addEventListener('keydown', handleKeyDown);

        return () => {
            ref.current?.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return ref;
};
