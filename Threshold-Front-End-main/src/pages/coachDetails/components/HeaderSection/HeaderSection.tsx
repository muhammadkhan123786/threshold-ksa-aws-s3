import { stringToDateString } from 'libs/helpers';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import React from 'react';
import { AvatarImage } from 'components/avatarImage';

interface HeaderSectionProps {
    coachDetails?: any;
    contractStatus?: string;
    sport?: string;
    academyName?: string;
    personalInfo?: any;
}
const HeaderSection: React.FC<HeaderSectionProps> = ({
    coachDetails,
    contractStatus,
    sport,
    academyName,
    personalInfo,
}) => {
    const { trans } = useLocales();

    const fakeData = {
        subscription: {
            status: 'pending',
        },
        joinDate: '2025-01-20',
        type: 'Head',
    };
    const translatedLanguages = personalInfo?.languages
        ?.map((lang: string) => trans(`language.${lang}`))
        .join(` ${trans('language.common.and')} `);
    return (
        <Theme.HeaderWrapper>
            <Theme.HeaderInfoWrapper>
                <Theme.BoxWrapper>
                    <Theme.SportSpan>{trans(`sport.${sport}`)}</Theme.SportSpan>
                    <Theme.AcademySpan>{academyName}</Theme.AcademySpan>
                </Theme.BoxWrapper>
                <Theme.PlayerNameSpan>{coachDetails.name}</Theme.PlayerNameSpan>
                <Theme.SportUserDetails>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>{trans('coach.profile.details.id')}</Theme.DataLabel>
                        <Theme.DataContact># {coachDetails.id}</Theme.DataContact>
                    </Theme.UserInfoWrapper>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>{trans('coach.profile.details.age')}</Theme.DataLabel>
                        <Theme.DataContact>
                            {coachDetails.age.match(/\d+/g)?.[0]}{' '}
                            {trans('coach.profile.details.yearsOld')}
                        </Theme.DataContact>
                    </Theme.UserInfoWrapper>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>
                            {trans('coach.profile.details.experience')}
                        </Theme.DataLabel>
                        <Theme.DataContact>
                            {coachDetails.experience} {trans('coach.profile.details.years')}
                        </Theme.DataContact>
                    </Theme.UserInfoWrapper>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>
                            {trans('coach.profile.details.nationality')}
                        </Theme.DataLabel>
                        <Theme.DataContact>
                            {trans(`form.editAthleteProfile.${coachDetails.nationality}`)}
                        </Theme.DataContact>
                    </Theme.UserInfoWrapper>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>
                            {trans('coach.profile.details.languages')}
                        </Theme.DataLabel>
                        <Theme.DataContact>{translatedLanguages}</Theme.DataContact>
                    </Theme.UserInfoWrapper>
                </Theme.SportUserDetails>
            </Theme.HeaderInfoWrapper>
            <Theme.IMGWrapper>
                <AvatarImage avatarUrl={personalInfo?.avatarUrl} date={personalInfo?.birthday} />
            </Theme.IMGWrapper>
            <Theme.HeaderInfoWrapper>
                <Theme.ContractInfoWrapper>
                    <Theme.ContractTitleSpan>
                        <ul>
                            {contractStatus === 'Active' && (
                                <li style={{ color: 'green' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${contractStatus.toLocaleLowerCase()}`,
                                    )}
                                </li>
                            )}
                            {contractStatus === 'inactive' && (
                                <li style={{ color: 'gray' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${contractStatus.toLocaleLowerCase()}`,
                                    )}
                                </li>
                            )}
                            {contractStatus === 'pending' && (
                                <li style={{ color: '#FFC000' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${contractStatus.toLocaleLowerCase()}`,
                                    )}
                                </li>
                            )}
                            {contractStatus === 'expired' && (
                                <li style={{ color: 'red' }}>
                                    {trans(
                                        `form.subscriptionManagement.status.${contractStatus.toLocaleLowerCase()}`,
                                    )}
                                </li>
                            )}
                        </ul>
                    </Theme.ContractTitleSpan>
                    <Theme.ContractDateSpan>
                        {trans('till')} {stringToDateString(fakeData?.joinDate)}
                    </Theme.ContractDateSpan>
                    <Theme.UserInfoCard>
                        <Theme.ClubLogoWrapper>
                            <img src="/assets/images/club-logo.svg" alt="club logo" />
                        </Theme.ClubLogoWrapper>
                        <Theme.UserInfoStatus>
                            <Theme.DarkLabel>
                                {trans('coach.profile.details.male')}, 12-14
                                {trans('coach.profile.details.years')}
                            </Theme.DarkLabel>
                            <Theme.LeighLabel>2 Assistants</Theme.LeighLabel>
                        </Theme.UserInfoStatus>
                        <Theme.UserType>
                            <Theme.TypeLabel>
                                {trans(`form.addCoach.${coachDetails.profile.type}`)}
                            </Theme.TypeLabel>
                        </Theme.UserType>
                    </Theme.UserInfoCard>
                    <Theme.UserInfoCard>
                        <Theme.NextSessionWrapper>
                            <Theme.NextSessionLabel>
                                {trans('coach.profile.details.nextSession')}
                            </Theme.NextSessionLabel>
                            <Theme.UserInfoStatus>
                                <Theme.DarkLabel>
                                    {trans('coach.profile.details.sessionTitle')}
                                </Theme.DarkLabel>
                                <Theme.LeighLabel>
                                    {trans('coach.profile.details.starts')}: 2:30{' '}
                                    {trans('coach.profile.details.pm')}{' '}
                                    {trans('coach.profile.details.ends')}: 6:00{' '}
                                    {trans('coach.profile.details.pm')}
                                </Theme.LeighLabel>
                            </Theme.UserInfoStatus>
                        </Theme.NextSessionWrapper>
                        <Theme.NextDurationsWrapped>
                            <Theme.NextDurationsLabelHR>
                                2 {trans('coach.profile.details.hr')}
                            </Theme.NextDurationsLabelHR>
                            <Theme.NextDurationsLabel>
                                {trans('coach.profile.details.duration')}
                            </Theme.NextDurationsLabel>
                        </Theme.NextDurationsWrapped>
                    </Theme.UserInfoCard>
                </Theme.ContractInfoWrapper>
            </Theme.HeaderInfoWrapper>
        </Theme.HeaderWrapper>
    );
};

export default HeaderSection;
