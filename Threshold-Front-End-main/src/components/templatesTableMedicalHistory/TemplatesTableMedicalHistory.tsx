import React, { useEffect, useState } from 'react';
import { Table } from '../newSharedTable/NewSharedTable';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { EditMedicalRecord } from 'components/coachModals/medicalHistoryRecord';

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

export const TemplatesTableMedicalHistory: React.FC<TemplatesTableProps> = ({ columns, data }) => {
    const { trans } = useLocales();
    const [dataHere, setDataHere] = useState(data || []);
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

    const handleEditClick = (id: number) => {
        setSelectedId(id);
        setOpenModal(true);
    };

    useEffect(() => {
        setDataHere(data);
    }, [data]);
    return (
        <Theme.TableWrapper>
            <Theme.ResponsiveTableContainer>
                <EditMedicalRecord
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    id={selectedId}
                />
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
                                </Theme.DateWrapper>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.DateSpan>{row?.type}</Theme.DateSpan>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.DateSpan>{row?.description}</Theme.DateSpan>
                            </Theme.TableCell>
                            <Theme.TableCell>
                                <Theme.DateSpan>
                                    <button onClick={() => handleEditClick(row?.id)}>
                                        <img
                                            src="/assets/icons/edit.svg"
                                            alt="edit"
                                            height={24}
                                            width={24}
                                        />
                                    </button>
                                </Theme.DateSpan>
                            </Theme.TableCell>
                        </Theme.TableRow>
                    )}
                />
            </Theme.ResponsiveTableContainer>
        </Theme.TableWrapper>
    );
};
