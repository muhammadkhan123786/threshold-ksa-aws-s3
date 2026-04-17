import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { SizeModal } from '../sizeModal';
import { calculateYearsDifference } from 'libs/helpers';
import { Table } from '../newSharedTable/NewSharedTable';

interface TemplatesTableProps {
    columns: any;
    data: any;
    total: number;
}

export const TemplatesTableClothes: React.FC<TemplatesTableProps> = ({ columns, data, total }) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [athleteId, setAthleteId] = useState<string>('');
    const [dataRow, setDataRow] = useState<any>(null);

    const handleDataWithModal = (row: any) => {
        setAthleteId(row?.id);
        setDataRow(row);
        setIsModalOpen(true);
    };

    const handleCloseClick = () => {
        setIsModalOpen(false);
    };
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <SizeModal
                    isOpen={isModalOpen}
                    onClose={handleCloseClick}
                    athleteId={athleteId}
                    userDataRow={dataRow}
                />
                <Theme.StatusBar>
                    <Theme.UsersNumberTable>
                        {trans('table.all')} ({total})
                    </Theme.UsersNumberTable>
                </Theme.StatusBar>
                <Table
                    loading={false}
                    columns={(columns || []).map((col: any) => ({
                        ...col,
                        label: col.label,
                    }))}
                    data={data?.data || []}
                    renderRow={(row) => (
                        <Theme.TableRow key={row?.id}>
                            <Theme.TableCell>
                                <Theme.PersonInfoElement>
                                    {row?.avatarUrl ? (
                                        <Theme.PersonImage
                                            src={row?.avatarUrl}
                                            alt={`${row?.name || ''}`}
                                        />
                                    ) : (
                                        <Theme.PersonImage
                                            src="/assets/images/avatar-male.jpg"
                                            alt={`${row?.name || ''}`}
                                        />
                                    )}
                                    <Theme.PersonTextContainer>
                                        <Theme.PersonName>{row?.name}</Theme.PersonName>
                                    </Theme.PersonTextContainer>
                                </Theme.PersonInfoElement>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                {row?.gender === 'male' ? (
                                    <>
                                        <Theme.SpanCatygoryMale>
                                            {trans(`form.editAthletePersonalInfo.${row?.gender}`)}
                                            ,&nbsp;
                                            {calculateYearsDifference(
                                                new Date(),
                                                new Date(row?.dateOfBirth || ''),
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
                                                new Date(row?.dateOfBirth || ''),
                                            )}
                                        </Theme.SpanCatygoryFemale>
                                    </>
                                )}
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <p>{row?.joinedDate}</p>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.ClothesMissingWrapper>
                                    {(row?.assigned || []).map((item: any, index: number) => (
                                        <Theme.ParaMissingClothes
                                            key={`${item.size}-${item.quantity}-${index}`}
                                            style={{
                                                borderRadius: '12px',
                                                margin: '0px 5px',
                                                padding: '4px 6px',
                                                fontWeight: '500',
                                                backgroundColor: '#0398550F',
                                            }}
                                        >
                                            <span style={{ color: '#039855', fontSize: '12px' }}>
                                                {item.size}-{item.quantity}
                                            </span>
                                        </Theme.ParaMissingClothes>
                                    ))}

                                    {(row?.isDelivered || []).map((item: any, index: number) => (
                                        <Theme.ParaMissingClothes
                                            key={`${item.size}-${item.shortage}-${index}`}
                                            style={{
                                                borderRadius: '12px',
                                                margin: '0px 5px',
                                                padding: '4px 6px',
                                                fontWeight: '500',
                                                backgroundColor: '#ffc00014',
                                            }}
                                        >
                                            <span style={{ color: '#ffc000', fontSize: '12px' }}>
                                                {item.size}-{item.shortage}
                                            </span>
                                        </Theme.ParaMissingClothes>
                                    ))}

                                    {(row?.requirements || []).map((item: any, index: number) => (
                                        <Theme.ParaMissingClothes
                                            key={`${item.size}-${item.shortage}-${index}-alert`}
                                            style={{
                                                borderRadius: '12px',
                                                margin: '0px 5px',
                                                padding: '4px 6px',
                                                fontWeight: '500',
                                                backgroundColor: '#eb53530f',
                                            }}
                                        >
                                            <span style={{ color: '#eb5353', fontSize: '12px' }}>
                                                {item.size}-{item.shortage}
                                            </span>
                                        </Theme.ParaMissingClothes>
                                    ))}
                                </Theme.ClothesMissingWrapper>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <button type="button" onClick={() => handleDataWithModal(row)}>
                                    <img
                                        src="/assets/icons/edit.svg"
                                        height={24}
                                        width={24}
                                        alt={row?.name}
                                    />
                                </button>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
