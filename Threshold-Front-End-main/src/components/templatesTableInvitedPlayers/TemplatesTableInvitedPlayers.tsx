import React, { useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { FormRow } from 'components/modal-windows/FormRow';
import { InputController } from 'components/input';
import { useForm } from 'react-hook-form';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface TemplatesTableProps {
    columns: Column[];
    data: { [key: string]: any }[];
}

export const TemplatesTableInvitedPlayers: React.FC<TemplatesTableProps> = ({ columns, data }) => {
    const { trans } = useLocales();
    const { control } = useForm();
    const invitedPlayers = () => {
        console.log('Invited players');
    };
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')}
                        {`(${data?.length})`}
                    </Theme.UsersNumberTable>
                    <Theme.ButtonsWrapper onClick={invitedPlayers}>
                        <Theme.ButtonIcon
                            src="/assets/icons/add-icon-colored.svg"
                            height={16}
                            width={16}
                            alt="Invited Icon"
                        />
                        {trans('invited.players')}
                    </Theme.ButtonsWrapper>
                </Theme.StatusBar>

                <Table
                    columns={columns.map((col) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={data}
                    renderRow={(row) => (
                        <Theme.TableRow key={row.id}>
                            <Theme.TableCell>
                                <Theme.PersonInfoElement>
                                    <Theme.PersonImage
                                        src="/assets/images/person-image.png"
                                        alt={`${row.firstName} ${row.lastName}`}
                                    />
                                    <Theme.PersonTextContainer>
                                        <Theme.PersonName>{`${row.firstName} ${row.lastName}`}</Theme.PersonName>
                                        <Theme.PersonAge>{`#${row.contract.id}`}</Theme.PersonAge>
                                    </Theme.PersonTextContainer>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.position}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.attended}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <FormRow
                                    style={{ fontSize: '14px', display: 'block', color: '#7d7d7d' }}
                                    title={trans('add.sub.goal')}
                                    content={
                                        <InputController
                                            type="text"
                                            {...{
                                                control,
                                                name: 'description',
                                                placeholder: trans('write.simple.description'),
                                            }}
                                        />
                                    }
                                />
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
