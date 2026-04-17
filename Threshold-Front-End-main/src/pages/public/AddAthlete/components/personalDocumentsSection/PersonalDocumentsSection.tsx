import React, { useState, useEffect } from 'react';
import { useController, Control } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useUploadDocument } from 'services/hooks/athlete/useUploadDocuments';
import { router } from 'routers';
import { UploadText } from 'components/modal-windows/Theme';
import { DocumentType } from 'libs/enums/athlete';

interface DocumentItem {
    id?: string;
    type: { value: string; label: string };
    file: File;
}

interface PersonalDocumentsControllerProps {
    athleteId?: string;
    control: Control<any>;
    name: string;
    onChange?: (file: File) => void;
    type: DocumentType;
}

const PersonalDocumentsController: React.FC<PersonalDocumentsControllerProps> = ({
    athleteId,
    control,
    name,
    onChange,
    type = DocumentType.OTHER,
}) => {
    const dispatch = useDispatch();
    const { trans } = useLocales();
    const { field } = useController({
        name,
        control,
        defaultValue: null as DocumentItem | null,
    });

    const [fileName, setFileName] = useState<string>('');

    const { mutate: uploadDocuments } = useUploadDocument({
        onSuccess: () => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: 'Success',
                        subtitle: 'Athlete data has been updated',
                        redirect: {
                            path: 'home',
                            condition: true,
                        },
                    },
                }),
            );
            router.navigate('signin', { replace: true });
        },
        onError: () => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: trans('form.error_occurred'),
                    },
                }),
            );
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            field.onChange(file);
            onChange && onChange(file);
            +setFileName(file.name);
        }
    };

    const handleUploadDocument = () => {
        if (field.value && athleteId) {
            uploadDocuments({
                athleteId,
                type,
                file: field.value,
            });
        }
    };

    useEffect(() => {
        if (athleteId) handleUploadDocument();
    }, [athleteId]);

    return (
        <Theme.Body>
            <input
                type="file"
                id={`input-${name}`}
                hidden
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                {...field}
                value=""
                onChange={handleFileChange}
            />
            <label
                htmlFor={`input-${name}`}
                style={{
                    cursor: 'pointer',
                }}
                className="flex justify-center items-center"
            >
                <Theme.UploadIcon src="/assets/icons/upload-icon.png" alt="upload" />
                {fileName && <UploadText>{fileName}</UploadText>}
            </label>
        </Theme.Body>
    );
};

export default PersonalDocumentsController;
