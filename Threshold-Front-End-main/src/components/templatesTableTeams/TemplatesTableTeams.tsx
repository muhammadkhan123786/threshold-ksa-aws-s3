import React, { useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { TeamsModal } from '../teamsModal';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';
import { calculateYearsDifference } from 'libs/helpers';
import { SharedButton } from 'components/sharedButton';

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
    total?: any;
}

export const TemplatesTableTeams: React.FC<TemplatesTableProps> = ({
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

    const redirect = (id: number) => {
        router.navigate(`team-details`, { id, sportId });
    };

    function getMinMaxBirthDates(athletes: any[]) {
        if (!athletes || athletes.length === 0) return { minDate: null, maxDate: null };
        const birthDates: any = athletes.map((athlete) => new Date(athlete.dateOfBirth));
        const minDate = new Date(Math.min(...birthDates));
        const maxDate = new Date(Math.max(...birthDates));
        return {
            minDate: minDate.toISOString().split('T')[0],
            maxDate: maxDate.toISOString().split('T')[0],
        };
    }
    console.log(data);

    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <TeamsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')}
                        {`(${total || 0})`}
                    </Theme.UsersNumberTable>
                    <SharedButton variant="primary" onClick={() => setIsModalOpen(true)}>
                        <Theme.ButtonIcon
                            src="/assets/icons/add-icon.svg"
                            height={16}
                            width={16}
                            alt="Add Icon"
                        />
                        {trans('add.teams')}
                    </SharedButton>
                </Theme.StatusBar>

                <Table
                    loading={loading}
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={data}
                    renderRow={(row) => {
                        const { minDate, maxDate } = getMinMaxBirthDates(row?.athletes || []);
                        return (
                            <Theme.TableRow key={row?.id} onClick={() => redirect(row?.id)}>
                                <Theme.TableCell>
                                    {row?.athletes[0] ? (
                                        row?.athletes[0]?.gender === 'male' ? (
                                            <Theme.SpanCatygoryMale>
                                                {trans(
                                                    `form.editAthletePersonalInfo.${row?.athletes[0]?.gender}`,
                                                )}
                                                ,&nbsp;&nbsp;
                                                {/* {calculateYearsDifference(
                                                    new Date(),
                                                    new Date(row?.athletes[0]?.dateOfBirth || ''),
                                                )} */}
                                                {row?.athletes[0]?.category}
                                            </Theme.SpanCatygoryMale>
                                        ) : (
                                            <Theme.SpanCatygoryFemale>
                                                {trans(
                                                    `form.editAthletePersonalInfo.${row?.athletes[0]?.gender}`,
                                                )}
                                                ,&nbsp;&nbsp;
                                                {/* {calculateYearsDifference(
                                                    new Date(),
                                                    new Date(row?.athletes[0]?.dateOfBirth || ''),
                                                )} */}
                                                {row?.athletes[0]?.category}
                                            </Theme.SpanCatygoryFemale>
                                        )
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
                                    {row?.subCoaches[0] !== undefined ? (
                                        <>
                                            {`${row.subCoaches[0]?.firstName} ${row.subCoaches[0]?.lastName}`}
                                            {row.subCoaches.length > 1 && (
                                                <span> +{row.subCoaches.length - 1}</span>
                                            )}
                                        </>
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
