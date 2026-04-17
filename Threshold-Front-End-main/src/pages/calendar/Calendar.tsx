import { useState } from 'react';
import * as Theme from './Theme';
import { SportProfileManagerOverview } from 'components/sportProfileManagerOverview';

export const Calendar = () => {
    return (
        <Theme.Body>
            <SportProfileManagerOverview />
        </Theme.Body>
    );
};
