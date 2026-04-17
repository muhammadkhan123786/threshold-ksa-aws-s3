import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { authAPIs } from 'services/apis';
import { FilterMenu, Loader } from 'components';
import { ApprovalUsersTable } from 'components/tables';
import { selectAcademy } from 'store';
import { PaginationQuery } from 'libs/types/app';
import { ApprovalUser } from 'libs/types/auth';
import * as SharedTheme from '../Theme';
import { useFilterFields } from './useFilterFields';
import { useDataFilter } from 'hooks/helpers';

export const ApprovalUsers: React.FC = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch<any>();
    const { academy } = useSelector(selectAcademy);
    const [isLoading, setLoading] = useState(true);
    const [approvalUsers, setApprovalUsers] = useState<any>();

    const filterFields = useFilterFields();
    const {
        data: users,
        searchTerm,
        handlerSearchTermChange,
        applyFilters,
    } = useDataFilter<any>({
        initialData: approvalUsers,
        searchFields: ['username', 'email'],
        filterFields,
    });

    const fetchApprovalUsers = useCallback(async () => {
        if (!academy) return;

        const query: PaginationQuery = {
            academyId: academy.id,
            sortBy: 'createdAt',
        };

        setLoading(true);
        try {
            const response = await dispatch(authAPIs.getPendingApprovalUsers(query)({}));
            const { payload } = response as any;

            if (payload && payload.data && payload.data.payload) {
                setApprovalUsers(payload.data.payload);
            }
        } catch (error) {
            console.error('Failed to fetch approval users', error);
        } finally {
            setLoading(false);
        }
    }, [academy, dispatch]);

    useEffect(() => {
        fetchApprovalUsers();
    }, [fetchApprovalUsers]);

    if (isLoading) return <Loader />;

    return (
        <Theme.Body>
            <Theme.HeaderWrapper>
                <Theme.Title value={trans('approval.users.title')} variant="h2" />
            </Theme.HeaderWrapper>
            <SharedTheme.TableContainer>
                <SharedTheme.TableFilteContainer>
                    <SharedTheme.TableFilterSearchContainer>
                        <SharedTheme.FilterButton>
                            <FilterMenu
                                fields={filterFields}
                                onApplyFilters={applyFilters}
                                length={approvalUsers?.length}
                                filterName="approvalUsers"
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
                </SharedTheme.TableFilteContainer>

                {approvalUsers && <ApprovalUsersTable items={users} />}
            </SharedTheme.TableContainer>
        </Theme.Body>
    );
};
