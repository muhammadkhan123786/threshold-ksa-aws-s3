import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import * as SharedTheme from '../Theme';
import { useGetTeams } from 'hooks/data';
import { Team } from 'libs/types';
import * as Theme from './Theme';
import { useDataFilter } from 'hooks/helpers';
import { selectAcademy } from 'store';
import { ActiveTab, UserRole } from 'libs/enums';
import { router } from 'routers';
import { TeamsTable } from '../../components/tables/TeamsTable';
import { setBreadCrumps } from 'store/controlsSlice';
import { FilterMenu, Loader } from 'components';
import { WithRole } from 'hooks/roles';
import { useFilterFields } from './useFilterFields';

export const TeamsList = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();
    const { academy } = useSelector(selectAcademy);
    const { data: teamsData, isLoading } = useGetTeams<Team[]>({
        id: academy?.id,
        idType: 'academy',
        page: 0,
    });

    const filterFields = useFilterFields();

    const {
        data: teams,
        searchTerm,
        handlerSearchTermChange,
        applyFilters,
    } = useDataFilter<Team>({
        initialData: teamsData,
        filterFields,
        searchFields: ['name'],
    });

    const handleAddTeam = () => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [ActiveTab.TEAM_LIST, 'Add Team'],
            }),
        );
        router.navigate('addTeam', { replace: true });
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.TeamListBody>
            <SharedTheme.TableTitle value={trans('home.teamsList.tableTitle')} variant="h3" />
            <SharedTheme.TableContainer>
                <SharedTheme.TableFilteContainer>
                    <SharedTheme.TableFilterSearchContainer>
                        <SharedTheme.FilterWrapper>
                            <SharedTheme.FilterButton>
                                <FilterMenu
                                    fields={filterFields}
                                    onApplyFilters={applyFilters}
                                    length={teamsData?.length}
                                    filterName="teams"
                                />
                            </SharedTheme.FilterButton>
                            <WithRole blockRoles={[UserRole.COACH]}>
                                <SharedTheme.AddButton onClick={handleAddTeam}>
                                    {trans('home.teamsList.addButton')}
                                </SharedTheme.AddButton>
                            </WithRole>
                        </SharedTheme.FilterWrapper>

                        <SharedTheme.SearchWrapper>
                            <SharedTheme.SearchIcon
                                src="/assets/icons/athlete-list-search-icon.png"
                                alt="search"
                            />
                            <SharedTheme.SearchBox
                                placeholder={trans('home.teamsList.searchPlaceholder')}
                                value={searchTerm}
                                onChange={handlerSearchTermChange}
                            />
                        </SharedTheme.SearchWrapper>
                    </SharedTheme.TableFilterSearchContainer>
                </SharedTheme.TableFilteContainer>

                <TeamsTable teams={teams} />
            </SharedTheme.TableContainer>
        </Theme.TeamListBody>
    );
};
