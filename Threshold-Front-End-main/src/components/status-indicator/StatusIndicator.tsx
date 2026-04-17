import React from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';

interface StatusIndicatorProps {
    isActive: boolean;

    activeStatus?: {
        text: string;
        color: 'green';
    };
    inactiveStatus?: {
        text: string;
        color: 'gray' | 'red';
    };
}

export const StatusIndicator: React.FC<
    React.HTMLAttributes<HTMLDivElement> & StatusIndicatorProps
> = ({ isActive, activeStatus, inactiveStatus, ...rest }) => {
    const { trans } = useLocales();

    return (
        <Theme.Body
            $isActive={isActive}
            $activeColor={activeStatus?.color || 'green'}
            $inactiveColor={inactiveStatus?.color || 'gray'}
            {...rest}
        >
            <Theme.Text
                variant="p"
                value={
                    isActive
                        ? activeStatus?.text || trans('global.active')
                        : inactiveStatus?.text || trans('global.inactive')
                }
            />
        </Theme.Body>
    );
};
