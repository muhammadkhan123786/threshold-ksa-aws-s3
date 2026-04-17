import React from 'react';
import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Table } from 'components/table';
import { setModalContent } from 'store/controlsSlice';
import { useFetchAdminManagerById } from 'services/hooks';
import { AdminManager } from 'libs/types';
import { useRouter } from 'react-router5';
import { Loader } from 'components/loader';

export const BranchManagerTable: React.FC = () => {
    const { trans, formatDate } = useLocales();
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        params: { id },
    } = router.getState();

    const { data: adminManagersData, isLoading } = useFetchAdminManagerById(id);

    const handleAddNewInfo = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editAdminManagerInfo',
                    title: trans('form.addAdminManagerInfo.title'),
                    subtitle: trans('form.addAdminManagerInfo.subtitle'),
                    defaults: {},
                },
            }),
        );
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('adminManager.personal.Information')} />

                <Theme.Button onClick={handleAddNewInfo} $isTable={true}>
                    {trans('adminManager.personal.addNew', { defaultValue: 'Add new' })}
                </Theme.Button>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={4}
                        headerRow={[
                            trans('form.adminManager.username'),
                            trans('form.adminManager.email'),
                            trans('form.adminManager.role'),
                            trans('form.adminManager.createat'),
                        ]}
                        rowsComponents={(adminManagersData?.payload || [])?.map?.(
                            (adminManager: AdminManager) => [
                                adminManager.username || '-',
                                adminManager.email || '-',
                                trans(adminManager.role) || '-',
                                adminManager.createdAt ? formatDate(adminManager.createdAt) : '-',
                            ],
                        )}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
