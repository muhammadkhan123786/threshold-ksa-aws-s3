import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { ManagerModal } from '../managerModal';
import { useLocales } from 'hooks/locales';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: any;
    loading?: boolean;
}

export const TemplatesTablePlayersDetails: React.FC<TemplatesTableProps> = ({
    columns,
    data,
    loading,
}) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataHere, setDataHere] = useState(data || []);
    useEffect(() => {
        setDataHere(data);
    }, [data]);
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <Theme.StatusBar>{trans('player.history.table')}</Theme.StatusBar>
                <Table
                    loading={loading}
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={dataHere}
                    renderRow={(row) => (
                        <Theme.TableRow key={row?.id}>
                            <Theme.TableCell>
                                <span>{row?.startDate}</span>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <span>{row?.type}</span>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.description}</p>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
