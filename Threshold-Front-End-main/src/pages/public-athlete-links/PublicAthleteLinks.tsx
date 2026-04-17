import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocales } from 'hooks/locales';
import { FilterMenu, Loader } from 'components';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';

import { PublicAthleteLinksTable } from 'components/tables/PublicAthleteLinksTable';
import { useGetPublicAthleteLink } from 'services/hooks';
import { useFilterFields } from './useFilterFields';
import { useDataFilter } from 'hooks/helpers';

export const PublicAthleteLinks: React.FC = () => {
    const { trans } = useLocales();

    const dispatch = useDispatch<any>();

    const { data, isLoading } = useGetPublicAthleteLink();

    const filterFields = useFilterFields();
    const {
        data: linksData,
        searchTerm,
        handlerSearchTermChange,
        applyFilters,
    } = useDataFilter<any>({
        initialData: data?.payload ?? [],
        searchFields: ['academy.name'],
        filterFields,
    });

    const handleEditInfo = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'addNewLink',
                    title: trans('form.editPublicAthleteLink.title'),
                    subtitle: trans('form.editPublicAthleteLink.subtitle'),
                    defaults: {},
                },
            }),
        );
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.Body>
            <Theme.HeaderWrapper>
                <Theme.Title value={trans('home.public-athlete-links')} variant="h2" />
            </Theme.HeaderWrapper>
            <SharedTheme.TableContainer>
                <SharedTheme.TableFilteContainer>
                    <SharedTheme.TableFilterSearchContainer>
                        <SharedTheme.FilterButton>
                            <FilterMenu
                                fields={filterFields}
                                onApplyFilters={applyFilters}
                                length={(data?.payload ?? []).length}
                                filterName="publicLinkAccess"
                            />
                        </SharedTheme.FilterButton>
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
                    <PublicAthleteLinksTable links={linksData ?? []} />
                </SharedTheme.TableFilteContainer>
                <SharedTheme.AddButton onClick={handleEditInfo}>
                    {trans('athlete.add')}
                </SharedTheme.AddButton>
            </SharedTheme.TableContainer>
        </Theme.Body>
    );
};
