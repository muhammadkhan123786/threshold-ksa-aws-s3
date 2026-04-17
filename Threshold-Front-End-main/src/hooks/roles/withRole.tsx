import React from 'react';
import { useUserRole } from './useUserRole';
import { UserRole } from 'libs/enums';
interface WithRoleProps {
    allowRoles?: UserRole[];
    blockRoles?: UserRole[];
    children: React.ReactNode;
}

export const WithRole: React.FC<WithRoleProps> = ({ allowRoles, blockRoles, children }) => {
    const userRole = useUserRole();

    if (userRole) {
        if (blockRoles && blockRoles.includes(userRole)) {
            return null;
        }

        if (allowRoles && allowRoles.includes(userRole)) {
            return <>{children}</>;
        }

        if (!allowRoles) {
            return <>{children}</>;
        }
    }

    return null;
};
