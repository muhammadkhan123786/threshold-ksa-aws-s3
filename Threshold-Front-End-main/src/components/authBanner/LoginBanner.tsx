import React from 'react';
import * as RegistrationTheme from './Theme';

export const LoginBanner: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
    return (
        <RegistrationTheme.Body>
            <RegistrationTheme.LoginBackGround />
        </RegistrationTheme.Body>
    );
};
