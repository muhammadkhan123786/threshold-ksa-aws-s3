import React from 'react';
import * as Theme from './Theme';

interface CellProps {
    children?: React.ReactNode;
}

export const Cell: React.FC<CellProps> = ({ children }) => {
    return <Theme.StyledCell className="capitalize">{children}</Theme.StyledCell>;
};
