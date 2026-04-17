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

export const TemplatesTableManagerDetails: React.FC<TemplatesTableProps> = ({ columns, data }) => {
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
                                    <Theme.DateSpan>{row?.startDate}</Theme.DateSpan>
                                </Theme.DateWrapper>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.DateWrapper>
                                    <Theme.DateSpan>{row?.endDate}</Theme.DateSpan>
                                </Theme.DateWrapper>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.SessionsSpan>{row?.manageType}</Theme.SessionsSpan>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.SportTypeSpan>{row?.sportType}</Theme.SportTypeSpan>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.ContractWrapper>
                                    <ul>
                                        <li>
                                            <Theme.StatusSpan status={row?.contractStatus?.status}>
                                                {trans(
                                                    `manager.profile.details.status.${row?.contractStatus?.status}`,
                                                )}
                                            </Theme.StatusSpan>
                                        </li>
                                    </ul>
                                    <Theme.StatusDateSpan>
                                        {row?.contractStatus?.status === 'available' &&
                                            `${trans('manager.profile.details.till')} ${row
                                                ?.contractStatus?.till}`}
                                        {row?.contractStatus?.status === 'expired' &&
                                            `${trans('manager.profile.details.expired')} ${row
                                                ?.contractStatus?.till}`}
                                    </Theme.StatusDateSpan>
                                </Theme.ContractWrapper>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
