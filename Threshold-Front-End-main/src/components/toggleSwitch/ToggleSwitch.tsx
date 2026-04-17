import React from 'react';
import * as Theme from './Theme';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    return (
        <Theme.ToggleSwitchContainer>
            <Theme.ToggleSwitchInput type="checkbox" checked={checked} onChange={onChange} />
        </Theme.ToggleSwitchContainer>
    );
};
