import { useMemo } from 'react';
import { ASIDE_TABS } from 'libs/constants';
import { ActiveTab, UserRole } from 'libs/enums';
import { Academy } from 'libs/types';

interface AcademyWithBranches extends Academy {
    branches?: { id: string; name: string }[];
}

const useFilteredTabs = (role?: UserRole, academy?: AcademyWithBranches) => {
    return useMemo(() => {
        if (role === UserRole.ACADEMY_ADMIN) {
            if (academy?.isMultiBranch) {
                return ASIDE_TABS.filter(({ name }) =>
                    [
                        ActiveTab.DASHBOARD,
                        ActiveTab.ACADEMY_PROFILE,
                        ActiveTab.BRANCH,
                        ActiveTab.CONTACTS,
                        ActiveTab.ADMIN_PROFILE,
                    ].includes(name),
                );
            } else {
                return ASIDE_TABS.filter(
                    ({ name, roles }) => roles.includes(role) && name !== ActiveTab.BRANCH,
                );
            }
        }
        return ASIDE_TABS.filter(({ roles }) => roles.includes(role ?? UserRole.MEMBER));
    }, [role, academy]);
};

export default useFilteredTabs;
