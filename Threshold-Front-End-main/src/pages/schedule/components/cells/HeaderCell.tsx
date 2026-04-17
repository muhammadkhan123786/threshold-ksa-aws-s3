import React from 'react';
import * as Theme from './Theme';
interface HeaderCellProps {
    title: string;
    logo?: string;
}
export const HeaderCell: React.FC<HeaderCellProps> = ({ title, logo }) => {
    return (
        <Theme.StyledHeaderCell className="capitalize">
            {logo && <Theme.LogoImage src={logo} alt="Logo" />}
            {title}
        </Theme.StyledHeaderCell>
    );
};
