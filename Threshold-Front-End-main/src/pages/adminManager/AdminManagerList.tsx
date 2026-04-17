import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { useDispatch } from 'react-redux';
import { useGetCoaches } from 'hooks/data/useGetCoaches';
import { Coach } from 'libs/types';
import { useDataFilter } from 'hooks/helpers';
import { setBreadCrumps } from 'store/controlsSlice';
import { ActiveTab } from 'libs/enums';
import { router } from 'routers';
import { CoachesTable } from 'components/tables/CoachesTable';
import { FilterMenu, Loader } from 'components';
import { useFilterFields } from './useFilterFields';

export const AdminManagerList = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();
    const { data: coachesData, isLoading } = useGetCoaches<Coach[]>({ idType: 'academy', page: 0 });
    const tableTabsData = ['all', 'football', 'basketball', 'handball'];

    const filterFields = useFilterFields();

    const {
        data: coaches,
        searchTerm,
        handlerSearchTermChange,
        applyFilters,
    } = useDataFilter<Coach>({
        initialData: coachesData,
        searchFields: ['firstName', 'lastName'],
        filterFields,
        radio: {
            radioOptions: tableTabsData,
            radioField: '',
            isMultiOption: true,
        },
    });

    const handleAddCoach = () => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [ActiveTab.COACH_LIST, 'Add Coach'],
            }),
        );
        router.navigate('addCoach', { replace: true });
    };

    if (isLoading) return <Loader />;
    return (
        <Theme.CoachListBody>
            <SharedTheme.TableTitle value={trans('home.coachesList.tableTitle')} variant="h3" />

            <SharedTheme.TableUnderline />

            <SharedTheme.TableContainer>
                <SharedTheme.FilterButton>
                    <FilterMenu
                        fields={filterFields}
                        onApplyFilters={applyFilters}
                        length={coachesData?.length}
                        filterName="coaches"
                    />
                </SharedTheme.FilterButton>

                <SharedTheme.SearchWrapper>
                    <SharedTheme.SearchIcon
                        src="/assets/icons/athlete-list-search-icon.png"
                        alt="search"
                    />
                    <SharedTheme.SearchBox
                        placeholder={trans('home.coachesList.searchPlaceholder')}
                        value={searchTerm}
                        onChange={handlerSearchTermChange}
                    />
                </SharedTheme.SearchWrapper>

                <SharedTheme.AddButton onClick={handleAddCoach}>
                    {trans('home.coachesList.addButton')}
                </SharedTheme.AddButton>

                <CoachesTable coaches={coaches} />
            </SharedTheme.TableContainer>
        </Theme.CoachListBody>
    );
};
