import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import { MultiSelectController } from 'components/multi-selection';
import { InputPdfController } from 'components/inputFilesController';
import { arrayToSelectOptions } from 'libs/helpers';
import * as Theme from './Theme';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'routers';
import { FormRow } from 'components/modal-windows/FormRow';
import { DocumentType } from 'libs/enums';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDocumentSchema } from 'schemas';
import { useAddPlayerDocs } from 'services/hooks/players/useAddPlayerDocs';
import { useFetchPlayerDocumentsById } from 'services/hooks/players/useFetchDocumentsById';
import { SharedButton } from 'components/sharedButton';

interface AddNewDocumentFormData {
    file: File;
    type: any;
}

interface AddNewDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: AddNewDocumentFormData;
}

export const AddNewDocumentFile: React.FC<AddNewDocumentModalProps> = ({
    isOpen,
    onClose,
    defaultValues,
}) => {
    const { trans } = useLocales();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const {
        params: { sportId, id },
    } = router.getState();
    const methods = useForm<AddNewDocumentFormData>({
        mode: 'all',
        resolver: yupResolver(useDocumentSchema()) as any,
        defaultValues: defaultValues || {},
    });
    const { refetch } = useFetchPlayerDocumentsById(id);

    const { mutate } = useAddPlayerDocs(id, {
        onSuccess: (response: any) => {
            refetch(),
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: trans('form.success'),
                            subtitle: trans('record.added_successfully'),
                        },
                    }),
                );
        },
        onError: (error: any) => {
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

    const handleSave: SubmitHandler<AddNewDocumentFormData> = async (data) => {
        setIsLoading(true);
        const formattedData = {
            file: data.file,
            type: data.type.value,
        };
        mutate(formattedData);
        onClose();
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            methods.reset(defaultValues || {});
            methods.clearErrors();
        }
    }, [isOpen, defaultValues, methods]);

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                title={trans('coach.profile.addNewDocument')}
            >
                <Theme.Body>
                    {/* Document file Input */}
                    <Theme.InputsWrapper>
                        <InputPdfController
                            name="file"
                            control={methods.control}
                            showProgress={true}
                            contents={
                                <Theme.UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>{' '}
                                    {trans('form.editAthleteProfile.uploadText2')}
                                    <br />
                                    {trans('form.editAthleteProfile.uploadText4')}
                                </Theme.UploadText>
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* Type Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d', marginTop: '0' }}
                            title={trans('coach.profile.Edit.documentType')}
                            content={
                                <MultiSelectController
                                    control={methods.control}
                                    name="type"
                                    options={arrayToSelectOptions({ array: DocumentType })}
                                    transSuffix="documentType."
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    <Theme.LineHR />

                    {/* Save Button */}
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton
                            variant="secondary"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            {isLoading ? (
                                <SaveLoaderButton spinnerColor="#C0D330" trackColor="#C0D330" />
                            ) : (
                                trans('form.save')
                            )}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
