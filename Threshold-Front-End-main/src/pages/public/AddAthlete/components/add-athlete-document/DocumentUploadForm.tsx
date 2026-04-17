import React from 'react';
import { useLocales } from 'hooks/locales';
import { useForm, Controller } from 'react-hook-form';
import { InputPdfController } from 'components/inputFilesController';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDocumentUploadSchema } from 'schemas/athlete/addAtheleteBank';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { DocumentType } from 'libs/enums/athlete';
import { FormControlsProps, FormRow, FormWindowProps } from 'components/modal-windows/FormRow';
import { Divider, UploadText } from 'components/modal-windows/Theme';
import ButtonsControls from 'components/modal-windows/ButtonsControls';
import { Body } from 'components/modal-windows/add-athelete-bank/Theme';
import { useDispatch } from 'react-redux';
import { closeModal } from 'store/controlsSlice';
import { v4 as uuidv4 } from 'uuid';

export const LocalDocumentUploadForm: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = ({ defaultValues, handleCancel }) => {
    const { trans } = useLocales();
    const createSchema = useDocumentUploadSchema();
    const dispatch = useDispatch();
    const { handleSave } = defaultValues;
    const { control, handleSubmit, trigger } = useForm({
        mode: 'all',
        resolver: yupResolver(createSchema),
        defaultValues: defaultValues || {},
    });

    const onSubmit = (data: any) => {
        handleSave({ type: data?.type, file: data.file, id: uuidv4() });
        dispatch(closeModal());
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
                        handleSave={handleSubmit(onSubmit)}
                        handleCancel={handleCancel}
                        saveText={trans('form.save')}
                        cancelText={trans('form.cancel')}
                    />
                }
            />
        </Body>
    );
};
