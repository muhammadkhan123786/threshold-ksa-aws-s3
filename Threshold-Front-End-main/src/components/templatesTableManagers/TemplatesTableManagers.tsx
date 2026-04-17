import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { ManagerModal } from '../managerModal';
import { useLocales } from 'hooks/locales';
import { SharedButton } from 'components/sharedButton';
import { router } from 'routers';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: { [key: string]: any }[];
    total: any;
    loading?: boolean;
}

export const TemplatesTableManagers: React.FC<TemplatesTableProps> = ({
    columns,
    data,
    total,
    loading,
}) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        params: { academyId },
    } = router.getState();
    const redirect = (id: number, row: any) => {
        router.navigate(`manager-details`, { id, academyId });
    };
    console.log(data);
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <ManagerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')}
                        {`(${total?.total})`}
                    </Theme.UsersNumberTable>
                    <SharedButton onClick={() => setIsModalOpen(true)}>
                        <Theme.ButtonIcon
                            src="/assets/icons/add-icon.svg"
                            height={16}
                            width={16}
                            alt="Add Icon"
                        />
                        {trans('add.manager')}
                    </SharedButton>
                </Theme.StatusBar>

                <Table
                    loading={loading}
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={data}
                    renderRow={(row) => (
                        <Theme.TableRow key={row?.id} onClick={() => redirect(row?.id, row)}>
                            <Theme.TableCell>
                                <Theme.PersonInfoElement>
                                    {row?.avatar ? (
                                        <Theme.PersonImage
                                            src={row?.avatar}
                                            alt={`${row?.firstName || ''} ${row?.lastName || ''}`}
                                        />
                                    ) : (
                                        <Theme.PersonImage
                                            src="/assets/images/avatar-male.jpg"
                                            alt={`${row?.firstName || ''} ${row?.lastName || ''}`}
                                        />
                                    )}
                                    <Theme.PersonTextContainer>
                                        <Theme.PersonName>{`${row?.firstName} ${row?.lastName}`}</Theme.PersonName>
                                        <Theme.PersonAge>{`#${row?.academy?.id}`}</Theme.PersonAge>
                                    </Theme.PersonTextContainer>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <span>{row?.experience}</span> {trans('years')}
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{trans(`form.add.manager.${row?.user?.role}`)}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.SpanContracter>
                                    {trans(`select.option.${row?.contract?.type}`)}
                                </Theme.SpanContracter>
                                <p>{row?.joinDate}</p>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
