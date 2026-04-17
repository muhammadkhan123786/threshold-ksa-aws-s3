import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';
import { calculateYearsDifference, stringToDateString } from 'libs/helpers';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: any | { [key: string]: any }[];
}

export const SessionTemplatesTable: React.FC<TemplatesTableProps> = ({ columns, data }) => {
    const { trans } = useLocales();
    const [tableData, setTableData] = useState(data?.payload?.items);
    const {
        params: { sportId },
    } = router.getState();
    const redirect = (id: number) => {
        router.navigate(`players-details`, { id, sportId });
    };
    return (
        <div>
            <Table
                columns={columns.map((col) => ({
                    ...col,
                    label: col.label,
                }))}
                data={[]}
                renderRow={(row) => (
                    <Theme.TableRow key={row?.id} onClick={() => redirect(row?.id)}>
                        <Theme.TableCell>{row?.experience}</Theme.TableCell>
                        <Theme.TableCell>{row?.type}</Theme.TableCell>
                        <Theme.TableCell>{row?.user?.email}</Theme.TableCell>
                    </Theme.TableRow>
                )}
            />
        </div>
    );
};
