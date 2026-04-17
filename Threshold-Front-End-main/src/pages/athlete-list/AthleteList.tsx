import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { useEffect, useMemo, useState } from 'react';
import { Athlete } from 'libs/types';
import { router } from 'routers';
import { useDispatch, useSelector } from 'react-redux';
import { AthletesTable } from '../../components/tables/AthletesTable';
import { getActiveAthletes } from 'libs/helpers';
import { ActiveTab, SubscriptionStatus, UserRole } from 'libs/enums';
import { useGetAthletes } from 'hooks';
import { useDataFilter } from 'hooks/helpers';
import { setBreadCrumps } from 'store/controlsSlice';
import { FilterMenu, Loader } from 'components';
import { WithRole } from 'hooks/roles';
import { useFilterFields } from './useFilterFields';
import { useGetSubscriptionAnalytics } from 'services/hooks';

export const AthleteList = () => {
    const { trans } = useLocales();

    const dispatch = useDispatch<any>();
    const savedFilters = useSelector((state: any) => state.filters['athletes'] || {});
    const [search, setSarch] = useState('');

    const { data: athletesData, isLoading } = useGetAthletes<Athlete[]>({
        idType: 'academy',
        subscriptionStatus: savedFilters?.subscriptionStatus,
        firstName: search,
        level: savedFilters?.level?.value, // Add the level filter here
    });

    const filterFields = useFilterFields();
    const {
        data: athletes,
        searchTerm,
        handlerSearchTermChange,
        applyFilters,
    } = useDataFilter<Athlete>({
        initialData: athletesData,
        searchFields: ['firstName', 'lastName'],
        filterFields,
        radio: {
            radioField: 'sport',
            radioOptions: ['football', 'basketball', 'handball'],
            isMultiOption: true,
        },
    });

    const { activeAthletes, inActiveAthletes } = getActiveAthletes(athletes);
    useEffect(() => {
        if (searchTerm) {
            setSarch(searchTerm);
        } else {
            setSarch('');
        }
    }, [searchTerm]);

    const {
        data: subscriptionAnalytic,
        isLoading: subscriptionAnalyticsLoading,
        error,
    } = useGetSubscriptionAnalytics();

    const headBoxesData = useMemo(
        () => [
            {
                title: trans('home.athleteList.total'),
                athletesNumber: subscriptionAnalytic?.payload?.total,
                iconPath: '/assets/icons/athlete-list-total-icon.png',
            },
            {
                title: trans('home.athleteList.active'),
                athletesNumber: subscriptionAnalytic?.payload?.active,
                iconPath: '/assets/icons/athlete-list-active-icon.png',
            },
            {
                title: trans('home.athleteList.notActive'),
                athletesNumber: subscriptionAnalytic?.payload?.expired,
                iconPath: '/assets/icons/athlete-list-not-active-icon.png',
            },
        ],
        [trans, subscriptionAnalytic?.payload],
    );

    const handleAddAthlete = () => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [ActiveTab.ATHLETE_LIST, 'Add Athlete'],
            }),
        );
        router.navigate('addAthlete', { replace: true });
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.Body>
            <Theme.HeadBoxesWrapper>
                {headBoxesData &&
                    headBoxesData.map(({ title, athletesNumber, iconPath }, index) => (
                        <Theme.HeadBoxContainer key={`HeadBox item: ${index}`}>
                            <Theme.HeadBoxTitle value={title} variant="p" />
                            <Theme.HeadBoxIcon src={iconPath} alt={title} />
                            <Theme.HeadBoxNumber
                                value={`${athletesNumber} ${trans('home.athleteList.athletes')}`}
                                variant="p"
                            />
                        </Theme.HeadBoxContainer>
                    ))}
            </Theme.HeadBoxesWrapper>

            <SharedTheme.TableTitle value={trans('home.athleteList.tableTitle')} variant="h3" />

            <SharedTheme.TableUnderline />

            <SharedTheme.TableContainer>
                <SharedTheme.TableFilteContainer>
                    <SharedTheme.TableFilterSearchContainer>
                        <SharedTheme.FilterWrapper>
                            <SharedTheme.FilterButton>
                                <FilterMenu
                                    fields={filterFields}
                                    onApplyFilters={applyFilters}
                                    length={athletesData?.length}
                                    filterName="athletes"
                                />
                            </SharedTheme.FilterButton>
                            <WithRole blockRoles={[UserRole.COACH]}>
                                <SharedTheme.AddButton onClick={handleAddAthlete}>
                                    {trans('home.athleteList.addButton')}
                                </SharedTheme.AddButton>
                            </WithRole>
                        </SharedTheme.FilterWrapper>

                        <SharedTheme.SearchWrapper>
                            <SharedTheme.SearchIcon
                                src="/assets/icons/athlete-list-search-icon.png"
                                alt="search"
                            />
                            <SharedTheme.SearchBox
                                placeholder={trans('home.athleteList.searchPlaceholder')}
                                value={searchTerm}
                                onChange={handlerSearchTermChange}
                            />
                        </SharedTheme.SearchWrapper>
                    </SharedTheme.TableFilterSearchContainer>
                </SharedTheme.TableFilteContainer>
                <AthletesTable athletes={athletesData} />
            </SharedTheme.TableContainer>
        </Theme.Body>
    );
};
