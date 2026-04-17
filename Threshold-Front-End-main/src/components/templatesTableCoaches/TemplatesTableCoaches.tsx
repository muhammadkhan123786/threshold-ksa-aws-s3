import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { CoachesModal } from '../CoachesModal';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';
import { SharedButton } from 'components/sharedButton';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: { [key: string]: any }[];
    loading?: boolean;
    total: number;
}

export const TemplatesTableCoaches: React.FC<TemplatesTableProps> = ({
    columns,
    data,
    loading,
    total,
}) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        params: { sportId },
    } = router.getState();

    const redirect = (id: number, row: any) => {
        router.navigate(`coach-details`, { id, sportId });
    };

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }
    }, [isModalOpen]);

    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <CoachesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')}
                        {`(${total || 0})`}
                    </Theme.UsersNumberTable>
                    <SharedButton onClick={() => setIsModalOpen(true)}>
                        <Theme.ButtonIcon
                            src="/assets/icons/add-icon.svg"
                            height={16}
                            width={16}
                            alt="Add Icon"
                        />
                        {trans('add.coach')}
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
                                    {row?.avatarUrl ? (
                                        <Theme.PersonImage
                                            src={row?.avatarUrl}
                                            alt={`${row?.firstName || ''} ${row?.lastName || ''}`}
                                        />
                                    ) : (
                                        <Theme.PersonImage
                                            src="/assets/images/avatar-male.jpg"
                                            alt={`${row?.firstName || ''} ${row?.lastName || ''}`}
                                        />
                                    )}
                                    <Theme.PersonTextContainer>
                                        <Theme.PersonName>{`${row.firstName} ${row.lastName}`}</Theme.PersonName>
                                    </Theme.PersonTextContainer>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <span>{row?.experience}</span> {trans('years')}
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{trans(`form.addCoach.${row?.type}`)}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                {row?.teamCategory ? (
                                    <p>{row?.teamCategory}</p>
                                ) : (
                                    <img
                                        src="/assets/icons/NullIcon.svg"
                                        alt="Null Icon"
                                        width="16"
                                        height="16"
                                    />
                                )}
                            </Theme.TableCell>
                            <Theme.TableCell>
                                {row?.email ? (
                                    <p>{row?.email}</p>
                                ) : (
                                    <img
                                        src="/assets/icons/NullIcon.svg"
                                        alt="Null Icon"
                                        width="16"
                                        height="16"
                                    />
                                )}
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.SpanContracter>
                                    {trans('add.availableContract')}
                                </Theme.SpanContracter>
                                <p>
                                    {trans('till')}{' '}
                                    {new Date(row?.joinDate).toISOString().split('T')[0]}
                                </p>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
