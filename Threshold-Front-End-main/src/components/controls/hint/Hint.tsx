import * as InputTheme from './Theme';
import React from 'react';

type HintProps = {
    message?: string;
    error?: string;
    children?: React.ReactNode;
};

export const Hint: React.FC<HintProps> = ({ message, error, children }) => {
    return (
        <InputTheme.Body $show={message || error || children}>
            {message || error || children}
        </InputTheme.Body>
    );
};
