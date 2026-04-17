import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { router } from 'routers';
import { calculateYearsDifference, stringToDateString } from 'libs/helpers';
import { AdministratorModal } from 'components/administratorModals';
import { SharedButton } from 'components/sharedButton';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: any | { [key: string]: any }[];
    loading?: boolean;
    total: number;
}

export const TemplatesTableAdministrator: React.FC<TemplatesTableProps> = ({
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
        router.navigate(`administrator-details`, { id, sportId });
    };
    console.log(data);
    useEffect(() => {}, [isModalOpen]);
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <AdministratorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
                        {trans('add.administrator')}
                    </SharedButton>
                </Theme.StatusBar>

                <Table
                    loading={loading}
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={data || []}
                    renderRow={(row) => (
                        <Theme.TableRow key={row?.id} onClick={() => redirect(row?.id)}>
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
                                        <Theme.PersonName>{`${row?.firstName} ${row?.lastName}`}</Theme.PersonName>
                                        <Theme.PersonAge>{`#${row?.id}`}</Theme.PersonAge>
                                    </Theme.PersonTextContainer>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>
                            <Theme.TableCell>{row?.experience}</Theme.TableCell>
                            <Theme.TableCell>{trans(`form.addCoach.${row.type}`)}</Theme.TableCell>
                            <Theme.TableCell>
                                {row?.gender === 'male' ? (
                                    <>
                                        <Theme.SpanCatygoryMale>
                                            {trans(`form.editAthletePersonalInfo.${row?.gender}`)}
                                            ,&nbsp;
                                            {calculateYearsDifference(
                                                new Date(),
                                                new Date(row?.birthday || ''),
                                            )}
                                        </Theme.SpanCatygoryMale>
                                    </>
                                ) : (
                                    <>
                                        <Theme.SpanCatygoryFemale>
                                            {trans(`form.editAthletePersonalInfo.${row?.gender}`)}
                                            ,&nbsp;
                                            {calculateYearsDifference(
                                                new Date(),
                                                new Date(row?.birthday || ''),
                                            )}
                                        </Theme.SpanCatygoryFemale>
                                    </>
                                )}
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.SpanContracter>
                                    {trans('add.availableContract')}
                                </Theme.SpanContracter>
                                <p>
                                    {trans('till')}
                                    {new Date(row.joinDate).toISOString().split('T')[0]}
                                </p>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
