import { useMemo } from 'react';
import { useClubList } from 'services/hooks/clubProfile/useClubList';

interface ClubProfile {
    id: string;
    sport: string;
    avatarUrl: string;
}

interface Response {
    message: string;
    payload: ClubProfile[];
    status: number;
}

interface MenuItem {
    name: string;
    id: string;
    iconPath: string;
    children: {
        name: string;
        iconPath: string;
        path: string;
    }[];
}

interface UseRemapResult {
    result: MenuItem[] | undefined;
    loading: boolean;
}

export const useRemapClubProfilesToMenuItems = (academyId: string): UseRemapResult => {
    const { data, isPending } = useClubList(academyId);

    const result = useMemo(() => {
        if (!data?.payload) {
            return undefined;
        }

        return data.payload.map((clubProfile) => ({
            name: clubProfile.sport,
            id: clubProfile.id,
            iconPath: '/assets/icons/menu-icon.svg',
            children: [
                {
                    name: 'menu.players',
                    iconPath: '/assets/icons/menu/players-icon.svg',
                    path: 'players',
                },
                {
                    name: 'menu.coaches',
                    iconPath: '/assets/icons/menu/coaches-icon.svg',
                    path: 'coaches',
                },
                {
                    name: 'menu.administrators',
                    iconPath: '/assets/icons/menu/administrator-icons.svg',
                    path: 'administrator',
                },
                {
                    name: 'menu.teams',
                    iconPath: '/assets/icons/menu/teams-icon.svg',
                    path: 'teams',
                },
                {
                    name: 'menu.medicalTeam',
                    iconPath: '/assets/icons/menu/medical-team-icon.svg',
                    path: '',
                },
                {
                    name: 'menu.supportTeam',
                    iconPath: '/assets/icons/menu/support-icon.svg',
                    path: '',
                },
                {
                    name: 'menu.clothes',
                    iconPath: '/assets/icons/menu/clothes-icon.svg',
                    path: 'club-clothes',
                },
            ],
        }));
    }, [data?.payload]);

    return { result, loading: isPending };
};
