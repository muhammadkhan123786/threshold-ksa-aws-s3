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

export const TemplatesTablePlayersSession: React.FC<TemplatesTableProps> = ({ columns, data }) => {
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
                                <span>{stringToDateString(row?.createdAt)}</span>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <span>{row?.curl}</span>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.push}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.trunk}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.sit}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.pacer}</p>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
