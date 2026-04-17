import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { ManagerModal } from '../managerModal';
import { useLocales } from 'hooks/locales';
import { stringToDateString } from 'libs/helpers';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: any;
}

export const TemplatesTablePlayerCompositionRecords: React.FC<TemplatesTableProps> = ({
    columns,
    data,
}) => {
    const { trans } = useLocales();
    const [dataHere, setDataHere] = useState(data || []);
    useEffect(() => {
        setDataHere(data);
    }, [data]);
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <Theme.StatusBar>{trans('player.history.table')}</Theme.StatusBar>
                <Table
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={dataHere}
                    renderRow={(row) => (
                        <Theme.TableRow key={row?.id}>
                            <Theme.TableCell>
                                <span>{stringToDateString(row?.date)}</span>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <span>{row?.weight}</span>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.height}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.bmi}</p>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
