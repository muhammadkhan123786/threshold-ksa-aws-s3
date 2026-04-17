import React from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useUploadDocument } from 'services/hooks/athlete/useUploadDocuments';

interface Document {
    id: string;
    type: { value: string; label: string };
    file: File;
}

interface DocumentCardProps {
    item: Document;
    onRemove: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ item, onRemove }) => {
    const { file, type } = item;
    const { trans } = useLocales();
    const { isPending } = useUploadDocument();

    const handleOpenDocument = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
        URL.revokeObjectURL(fileURL);
    };

    const handleRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onRemove(item.id);
    };

    return (
        <Theme.DocumentBox>
            <Theme.DocumentInfo>
                <Theme.DocumentType>
                    {trans(`documentType.${type.value}`, type.label)}
                </Theme.DocumentType>
            </Theme.DocumentInfo>
            {!isPending && (
                <Theme.Actions>
                    <Theme.ActionIcon onClick={handleOpenDocument}>
                        <FaEye />
                    </Theme.ActionIcon>
                    <Theme.ActionIcon onClick={handleRemoveClick}>
                        <FaTrash />
                    </Theme.ActionIcon>
                </Theme.Actions>
            )}
        </Theme.DocumentBox>
    );
};

export default DocumentCard;
