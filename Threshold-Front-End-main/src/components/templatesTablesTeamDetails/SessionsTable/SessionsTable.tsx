import React, { useState } from 'react';
import { Table } from '../../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { TeamsModal } from '../../teamsModal';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';

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

export const SessionsTable: React.FC<TemplatesTableProps> = ({ columns, data }) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tabledata, setTabledata] = useState(data?.payload?.items || []);

    const {
        params: { sportId },
    } = router.getState();

    const redirect = (id: number) => {
        // router.navigate(`team-details`, { id, sportId });
    };
    const redirectToSesstion = () => {
        router.navigate('add-sesstion-page');
        // router.navigate(`team-details`, { id, sportId });
    };

    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <TeamsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')}
                        {`(${tabledata?.length})`}
                    </Theme.UsersNumberTable>
                    <Theme.ButtonsWrapper type="button" onClick={() => redirectToSesstion()}>
                        <Theme.ButtonIcon
                            src="/assets/icons/add-icon.svg"
                            height={16}
                            width={16}
                            alt="Add Icon"
                        />
                        {trans('add.createsession')}
                    </Theme.ButtonsWrapper>
                </Theme.StatusBar>

                <Table
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={tabledata}
                    renderRow={(row) => {
                        return (
                            <Theme.TableRow key={row?.id} onClick={() => redirect(row?.id)}>
                                <Theme.TableCell>{row?.athletes[0]?.gender},</Theme.TableCell>
                                <Theme.TableCell>
                                    <span>{row?.name}</span>
                                </Theme.TableCell>
                                <Theme.TableCell>
                                    <span>{row?.athletes?.length}</span>
                                </Theme.TableCell>
                                <Theme.TableCell>
                                    <span>{row?.athletes?.length}</span>/
                                    <span>{row?.athletes?.length}</span>
                                </Theme.TableCell>
                                <Theme.TableCell>
                                    {row?.coach ? (
                                        <Theme.PersonTextContainer>
                                            <Theme.PersonName>{`${row.coach.firstName} ${row.coach.lastName}`}</Theme.PersonName>
                                            <Theme.PersonAge>{`#${row?.coach?.id}`}</Theme.PersonAge>
                                        </Theme.PersonTextContainer>
                                    ) : (
                                        <Theme.IconEmptyData
                                            src="/assets/icons/none-or-empty-data.svg"
                                            height={16}
                                            width={16}
                                            alt="Add Icon"
                                        />
                                    )}
                                </Theme.TableCell>
                                <Theme.TableCell>
                                    <Theme.IconEmptyData
                                        src="/assets/icons/none-or-empty-data.svg"
                                        height={16}
                                        width={16}
                                        alt="Add Icon"
                                    />
                                </Theme.TableCell>
                                <Theme.TableCell>
                                    <Theme.SessionsStatusDiv>
                                        <Theme.SpanContracter>
                                            {row?.sessions[0]?.status}
                                        </Theme.SpanContracter>
                                        <span>
                                            {row?.sessions[0]?.from}-{row?.sessions[0]?.to}
                                        </span>
                                    </Theme.SessionsStatusDiv>
                                </Theme.TableCell>
                            </Theme.TableRow>
                        );
                    }}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
