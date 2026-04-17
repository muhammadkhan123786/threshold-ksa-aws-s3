import React from 'react';
import * as Theme from './Theme';

interface AuthBannerProps {}

export const AuthFrame: React.FC<React.HTMLAttributes<HTMLDivElement> & AuthBannerProps> = () => {
    return <Theme.Body></Theme.Body>;
};
