import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
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
}

export const TemplatesTableCoachesDetails: React.FC<TemplatesTableProps> = ({ columns, data }) => {
    const { trans } = useLocales();
    const [dataHere, setDataHere] = useState(data || []);
    useEffect(() => {
        setDataHere(data);
    }, [data]);
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <Table
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={dataHere}
                    renderRow={(row) => (
                        <Theme.TableRow key={row?.id}>
                            <Theme.TableCell>
                                <Theme.DateWrapper>
                                    <Theme.DateSpan>{row?.date}</Theme.DateSpan>
                                    <Theme.TimeSpan>{row?.time}</Theme.TimeSpan>
                                </Theme.DateWrapper>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.StyledSpan teamCategory={row?.teamCategory}>
                                    {row?.teamCategory}
                                </Theme.StyledSpan>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.SessionsSpan>{row?.sessionType}</Theme.SessionsSpan>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.DateWrapper>{row?.attendance}</Theme.DateWrapper>
                            </Theme.TableCell>
                            <Theme.DateWrapper>
                                <Theme.DateSpan>{row?.avgPE}</Theme.DateSpan>
                                <Theme.TimeSpan>after: --</Theme.TimeSpan>
                            </Theme.DateWrapper>
                            <Theme.TableCell>
                                <Theme.StatusSpan status={row?.status}>
                                    {row?.status}
                                </Theme.StatusSpan>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
