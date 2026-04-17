import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AthletesTable } from '../../components/tables/AthletesTable';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { getActiveAthletes } from 'libs/helpers';
import { useGetTodayAthletes } from 'services/hooks';
import { selectAcademy } from 'store';
import { academyAPIs } from 'services/apis';
import { Loader } from 'components';
import { Athlete } from 'libs/types';
import { useBreadcrumbs } from 'hooks/breadcrumbs';

export const Dashboard: React.FC = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { academy } = useSelector(selectAcademy);
    const [academyName, setAcademyName] = useState<string | undefined>(undefined);
    const { data: athletesResponse, isLoading, error } = useGetTodayAthletes(academy?.id);
    const athletes = athletesResponse?.payload || [];

    const { activeAthletes, inActiveAthletes } = getActiveAthletes(athletes);

    useEffect(() => {
        if (academy?.id) {
            dispatch(academyAPIs.getAcademy(academy.id)()).then(({ payload: { data } }: any) => {
                const name = data?.payload?.name;
                setAcademyName(name);
            });
        }
    }, [dispatch, academy?.id]);

    useBreadcrumbs([{ label: trans('breadcrumbs.home'), path: 'home' }], trans);
    if (isLoading) return <Loader />;

    return (
        <Theme.Body>
            <Theme.HeaderWrapper>
                <Theme.Title value={academyName || academy.name} variant="h2" />
                <Theme.Subtitle value={trans('home.dashboard.subtitle')} variant="h3" />
            </Theme.HeaderWrapper>
            <Theme.ActiveBarBody className="flex flex-wrap gap-y-3">
                <Theme.ActiveAthletesWrapper>
                    <Theme.ActivePhrase value={trans('home.dashboard.active')} variant="p" />
                    <Theme.ActiveCounter value={activeAthletes.toString()} variant="p" />
                </Theme.ActiveAthletesWrapper>
                <Theme.InActiveAthletesWrapper>
                    <Theme.ActivePhrase value={trans('home.dashboard.inactive')} variant="p" />
                    <Theme.ActiveCounter value={inActiveAthletes.toString()} variant="p" />
                </Theme.InActiveAthletesWrapper>
            </Theme.ActiveBarBody>
            <Theme.TableContainer>
                <AthletesTable athletes={athletes as Athlete[]} />
            </Theme.TableContainer>
        </Theme.Body>
    );
};
