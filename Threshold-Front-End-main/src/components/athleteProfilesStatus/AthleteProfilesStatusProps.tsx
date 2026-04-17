import React from 'react';
import { useLocales } from 'hooks/locales';
import { AthleteStatus } from 'libs/enums';
import * as Theme from './theme';

interface AthleteProfile {
    sport?: string;
    status: string;
}

interface Team {
    sport?: string;
}

interface AthleteProfilesStatusProps {
    athleteProfiles: AthleteProfile[];
    team?: Team;
}

export const AthleteProfilesStatus: React.FC<AthleteProfilesStatusProps> = ({
    athleteProfiles,
    team,
}) => {
    const { trans } = useLocales();
    const maxProfilesToShow = 1;

    return (
        <Theme.Container>
            {athleteProfiles && athleteProfiles.length > 0 ? (
                <>
                    {athleteProfiles.slice(0, maxProfilesToShow).map((profile, index) => (
                        <Theme.AthleteProfileItem
                            key={index}
                            $isActive={profile.status === AthleteStatus.ACTIVE}
                            $inactiveColor={
                                profile.status === AthleteStatus.ACTIVE ? 'gray' : 'red'
                            }
                        >
                            {trans(`sport.${profile.sport || ''}`, profile.sport || '')}
                        </Theme.AthleteProfileItem>
                    ))}
                    {athleteProfiles.length > maxProfilesToShow && (
                        <Theme.MoreProfiles className=" truncate text-ellipsis">
                            {trans('profile.moreProfiles', {
                                count: athleteProfiles.length - maxProfilesToShow,
                            })}
                        </Theme.MoreProfiles>
                    )}
                </>
            ) : (
                <Theme.TeamStatus>
                    {trans(`sport.${team?.sport || ''}`, team?.sport || '') || '---'}
                </Theme.TeamStatus>
            )}
        </Theme.Container>
    );
};
