import { Loader } from 'components';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useSelector } from 'react-redux';
import { useClubInfo } from 'services/hooks/clubProfile/useClubInfo';
import { selectAcademy } from 'store';
import { useState } from 'react';
import { EditClubModal } from '../editClubModal/EditClubModal';
import { router } from 'routers';
import { useBreadcrumbs } from 'hooks/breadcrumbs';

export const ClubInfo = () => {
    const { academy } = useSelector(selectAcademy);
    const { isRTL, trans } = useLocales();

    const { data, error, isLoading } = useClubInfo(academy.id);
    useBreadcrumbs(
        [
            { label: trans('breadcrumbs.home'), path: 'home' },
            {
                label: trans('breadcrumbs.clubProfile'),
                path: 'clubProfile',
            },
        ],
        trans,
    );
    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>{trans('clubInfo.errorFetchingData')}</div>;
    }

    if (!data) {
        return <div>{trans('clubInfo.noDataAvailable')}</div>;
    }

    const { avatarUrl, createdAt, name, registrationNumber, contactNumber, address } = data.payload;
    const navigationToManagers = (academyId: string) => {
        router.navigate(`manager`, { academyId });
    };
    return (
        <Theme.Body>
            <Theme.LeftSection>
                <Theme.Avatar>
                    <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%' }} />
                </Theme.Avatar>
                <Theme.CreatedDate>
                    {trans('clubInfo.created')}
                    {new Date(createdAt || '').toLocaleDateString() ||
                        trans('clubInfo.noDateAvailable')}
                </Theme.CreatedDate>
            </Theme.LeftSection>

            <Theme.CenterSection>
                <Theme.Title className="capitalize">
                    {name || trans('clubInfo.noNameAvailable')}
                </Theme.Title>
                <Theme.Fields>
                    <Theme.FlexWrapper>
                        <Theme.Field>
                            <Theme.Label>{trans('clubInfo.commercialRegistration')}:</Theme.Label>
                            <Theme.Value>
                                {registrationNumber || trans('clubInfo.noRegistrationNumber')}
                            </Theme.Value>
                        </Theme.Field>
                        <Theme.Field>
                            <Theme.Label>{trans('clubInfo.address')}:</Theme.Label>
                            <Theme.Value>
                                {address || trans('clubInfo.noAddressAvailable')}
                            </Theme.Value>
                        </Theme.Field>
                    </Theme.FlexWrapper>
                    <Theme.Field>
                        <Theme.Label>{trans('clubInfo.phoneNumbers')}:</Theme.Label>
                        <Theme.Value>
                            {contactNumber || trans('clubInfo.noPhoneNumbers')}
                        </Theme.Value>
                    </Theme.Field>
                </Theme.Fields>
            </Theme.CenterSection>

            <Theme.RightSection>
                <EditClubModal initValue={data?.payload} />
                <div></div>
                <div></div>
                <Theme.ButtonPrimary
                    style={{
                        marginTop: '20px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    onClick={() => navigationToManagers(academy.id)}
                >
                    {trans('manager.redirct')}
                    {isRTL ? (
                        <Theme.Icon
                            src="/assets/icons/left-arrow.svg"
                            height={16}
                            width={16}
                            alt="left Icon"
                        />
                    ) : (
                        <Theme.Icon
                            src="/assets/icons/next-icon.svg"
                            height={16}
                            width={16}
                            alt="right Icon"
                        />
                    )}
                </Theme.ButtonPrimary>
            </Theme.RightSection>
        </Theme.Body>
    );
};
