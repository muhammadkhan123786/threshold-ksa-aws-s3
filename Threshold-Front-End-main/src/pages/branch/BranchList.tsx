import React from 'react';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { useDispatch } from 'react-redux';
import { setBreadCrumps } from 'store/controlsSlice';
import { ActiveTab } from 'libs/enums';
import { router } from 'routers';
import { FilterMenu, Loader } from 'components';
import { useFetchBranches } from 'services/hooks';
import { BranchesTable } from 'components/tables';

export const BranchList = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();

    const { data: branchesData, isLoading } = useFetchBranches();
    const branches = branchesData?.payload || [];

    const handleAddBranch = () => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [ActiveTab.BRANCH_LIST, trans('home.branchList.addBranch')],
            }),
        );
        router.navigate('addBranch', { replace: true });
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.CoachListBody>
            <SharedTheme.TableTitle value={trans('home.branchList.tableTitle')} variant="h3" />

            <SharedTheme.TableUnderline />

            <SharedTheme.TableContainer>
                <SharedTheme.TableFilteContainer>
                    <SharedTheme.TableFilterSearchContainer>
                        <SharedTheme.FilterButton>
                            <FilterMenu
                                fields={[]}
                                onApplyFilters={() => null}
                                length={branches.length}
                                filterName={trans('home.branchList.filterName')}
                            />
                        </SharedTheme.FilterButton>

                        <SharedTheme.SearchWrapper>
                            <SharedTheme.SearchIcon
                                src="/assets/icons/athlete-list-search-icon.png"
                                alt="search"
                            />
                            <SharedTheme.SearchBox
                                placeholder={trans('home.branchList.searchPlaceholder')}
                                value={''}
                            />
                        </SharedTheme.SearchWrapper>
                    </SharedTheme.TableFilterSearchContainer>
                    <SharedTheme.AddButton onClick={handleAddBranch}>
                        {trans('home.branchList.addButton')}
                    </SharedTheme.AddButton>
                </SharedTheme.TableFilteContainer>
                <BranchesTable branches={branches || []} />
            </SharedTheme.TableContainer>
        </Theme.CoachListBody>
    );
};
