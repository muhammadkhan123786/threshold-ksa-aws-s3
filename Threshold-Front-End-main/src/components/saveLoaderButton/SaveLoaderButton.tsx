import React from 'react';
import * as Theme from './Theme';

interface SaveLoaderButtonProps {
    spinnerColor?: string;
    trackColor?: string;
}

export const SaveLoaderButton: React.FC<SaveLoaderButtonProps> = ({ spinnerColor, trackColor }) => {
    return <Theme.LoaderCSS spinnerColor={spinnerColor} trackColor={trackColor} />;
};
