import React from 'react';
import { useLocales } from 'hooks/locales';
import { Body, Divider, UploadText } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { useForm } from 'react-hook-form';
import { useUpdateDocument, useUploadDocument } from 'services/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { setModalContent } from 'store/controlsSlice';
import { useDispatch } from 'react-redux';
import { InputPdfController } from 'components/inputFilesController';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDocumentUploadSchema } from 'schemas/athlete/addAtheleteBank';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { DocumentType } from 'libs/enums/athlete';
import ButtonsControls from '../ButtonsControls';

interface DocumentUploadFormData {
    file: File;
}

interface DocumentUploadFormProps {
    id?: string;
    type:
        | 'national_id'
        | 'passport'
        | 'resume'
        | 'certificate'
        | 'driver_license'
        | 'medical_report'
        | 'contract'
        | 'visa'
        | 'other';
    handleCancel: () => void;
    handleSave?: (data: DocumentUploadFormData) => void;
}

export const DocumentUploadForm: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const { defaultValues, id, handleCancel, handleSave } = props;
    const createSchema = useDocumentUploadSchema();

    const { control, handleSubmit, watch, trigger } = useForm({
        mode: 'all',
        resolver: yupResolver(createSchema),
        defaultValues: defaultValues || {},
    });

    // Watch the 'type' field
    const selectedType = watch('type');

    const mutate = defaultValues?.documentId
        ? useUpdateDocument(
              id,
              defaultValues?.documentId,
              selectedType?.value ? selectedType?.value : 'passport',
          )
        : useUploadDocument(
              defaultValues?.athleteId || id,
              selectedType?.value ? selectedType?.value : 'passport',
          );
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const handleFormSave = async (data: DocumentUploadFormData) => {
        mutate.mutate(data.file, {
            onSuccess: () => {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: trans('form.success'),
                            subtitle: trans('document.upload_success'),
                        },
                    }),
                );

                defaultValues?.refetch && defaultValues?.refetch?.();

                if (handleSave) {
                    handleSave(data);
                }
            },
            onError: (error: Error) => {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: trans('form.warning'),
                            subtitle: error.message || trans('form.error_occurred'),
                        },
                    }),
                );
            },
        });
    };

    return (
        <Body>
            <FormRow
                title={trans('athlete.medical.type')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'type',
                            options: arrayToSelectOptions({ array: DocumentType }),
                            transSuffix: 'documentType.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.personal.document')}
                content={
                    <InputPdfController
                        {...{
                            control,
                            trigger,
                            name: 'file',
                            contents: (
                                <UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>{' '}
                                    {trans('form.editAthleteProfile.uploadText2')}
                                    <br />
                                    {trans('form.editAthleteProfile.uploadText4')}
                                </UploadText>
                            ),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                content={
                    <ButtonsControls
                        handleSave={handleSubmit(handleFormSave)}
                        handleCancel={handleCancel}
                        saveText={trans('form.save')}
                        cancelText={trans('form.cancel')}
                    />
                }
            />
        </Body>
    );
};
