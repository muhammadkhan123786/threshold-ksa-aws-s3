import * as LabelTheme from './Theme';
import React from 'react';

type LabelProps = {
    name?: string;
    label?: string;
    children?: React.ReactNode;
};

export const Label: React.FC<LabelProps> = ({ name, label, children }) => {
    return (
        <LabelTheme.Body $show={name || label || children}>
            {name || label || children}
        </LabelTheme.Body>
    );
};
