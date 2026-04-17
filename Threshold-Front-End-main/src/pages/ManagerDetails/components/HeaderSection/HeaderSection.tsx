import { calculateYearsDifference, stringToDateString } from 'libs/helpers';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import React from 'react';
import { AvatarImage } from 'components/avatarImage';

interface HeaderSectionProps {
    managerDetails?: any;
    contractStatus?: string;
    sport?: string;
    academyName?: string;
    personalInfo?: any;
}
const HeaderSection: React.FC<HeaderSectionProps> = ({
    managerDetails,
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
                    <Theme.ManagerRoleSpan>
                        {trans(`form.manager.managementType.${personalInfo?.user?.role}`)}
                    </Theme.ManagerRoleSpan>
                    {/* <Theme.SportSpan>{trans(`sport.${sport}`)}</Theme.SportSpan> */}
                    <Theme.SportSpan>{managerDetails?.schoolName}</Theme.SportSpan>
                    <Theme.AcademySpan>{academyName}</Theme.AcademySpan>
                </Theme.BoxWrapper>
                <Theme.PlayerNameSpan>
                    {managerDetails?.firstName} {managerDetails?.lastName}
                </Theme.PlayerNameSpan>
                <Theme.SportUserDetails>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>{trans('coach.profile.details.id')}</Theme.DataLabel>
                        <Theme.DataContact># {managerDetails?.id}</Theme.DataContact>
                    </Theme.UserInfoWrapper>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>{trans('coach.profile.details.age')}</Theme.DataLabel>
                        <Theme.DataContact>
                            {calculateYearsDifference(
                                new Date(),
                                new Date(personalInfo?.birthday || ''),
                            )}
                            {trans('coach.profile.details.yearsOld')}
                        </Theme.DataContact>
                    </Theme.UserInfoWrapper>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>
                            {trans('coach.profile.details.experience')}
                        </Theme.DataLabel>
                        <Theme.DataContact>
                            {managerDetails?.experience} {trans('coach.profile.details.years')}
                        </Theme.DataContact>
                    </Theme.UserInfoWrapper>
                    <Theme.UserInfoWrapper>
                        <Theme.DataLabel>
                            {trans('coach.profile.details.nationality')}
                        </Theme.DataLabel>
                        <Theme.DataContact>
                            {trans(`form.editAthleteProfile.${managerDetails?.nationality}`)}
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
                <AvatarImage avatarUrl={managerDetails?.avatar} date={personalInfo?.birthday} />
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
                                {`14 ${trans('manager.profile.details.sports')}`}
                            </Theme.DarkLabel>
                            <Theme.LeighLabel>
                                {`56 ${trans('manager.profile.details.teams')}`}
                            </Theme.LeighLabel>
                        </Theme.UserInfoStatus>
                    </Theme.UserInfoCard>
                    <Theme.UserInfoCard>
                        <Theme.CardIconWrapper>
                            <img src="/assets/icons/cards/colored-clothes.svg" alt="Players icon" />
                        </Theme.CardIconWrapper>
                        <Theme.UserInfoStatus>
                            <Theme.DarkLabel>
                                {`8 ${trans('manager.profile.details.clothesTypes')}`}
                            </Theme.DarkLabel>
                            <Theme.ClothesStatusWrapper>
                                <Theme.AllGoodsWrapper>
                                    <Theme.AllGoodsLabel>
                                        <Theme.AllGoodsSpan>
                                            {trans('manager.profile.details.allGoods')}
                                        </Theme.AllGoodsSpan>{' '}
                                        / 189 {trans('manager.profile.details.players')}
                                    </Theme.AllGoodsLabel>
                                </Theme.AllGoodsWrapper>
                                <Theme.NotDeletedWrapper>
                                    <Theme.NotDeletedLabel>
                                        {`${trans('manager.profile.details.notDelivered')}: 1`}
                                    </Theme.NotDeletedLabel>
                                </Theme.NotDeletedWrapper>
                                <Theme.NeedToBeDeliveredWrapper>
                                    <Theme.NeedToBeDeliveredLabel>
                                        {`${trans('manager.profile.details.needed')}: 2`}
                                    </Theme.NeedToBeDeliveredLabel>
                                </Theme.NeedToBeDeliveredWrapper>
                            </Theme.ClothesStatusWrapper>
                        </Theme.UserInfoStatus>
                    </Theme.UserInfoCard>
                </Theme.ContractInfoWrapper>
            </Theme.HeaderInfoWrapper>
        </Theme.HeaderWrapper>
    );
};

export default HeaderSection;
