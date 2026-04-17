import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
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
import { LabelInput } from 'components/labelInput';
import { FormRow } from 'components/modal-windows/FormRow';
import { DocumentType } from 'libs/enums';
import { useAddCoachDocument, useFetchDocumentsById } from 'services/hooks/coachDetails';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDocumentSchema } from 'schemas';
import { InputController } from 'components/input';
import { SharedButton } from 'components/sharedButton';

interface AddNewDocumentFormData {
    file: File;
    type: object;
}

interface addNewDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: AddNewDocumentFormData;
}

export const AddNewDocumentFile: React.FC<addNewDocumentModalProps> = ({
    isOpen,
    onClose,
    defaultValues,
}) => {
    const { trans } = useLocales();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { modalContent } = useSelector(selectControls);
    const {
        params: { sportId, id },
    } = router.getState();
    const { refetch } = useFetchDocumentsById(sportId, id);
    const { mutate } = useAddCoachDocument(sportId, id, {
        onSuccess: (response) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('player.personalDataUpdatedSuccess')
                            : response.message || trans('form.error_occurred'),
                    },
                }),
            );

            onClose();
            refetch();
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
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
    const methods = useForm<AddNewDocumentFormData>({
        mode: 'all',
        resolver: yupResolver(useDocumentSchema()) as any,
        defaultValues: defaultValues || {},
    });

    const handleSave: SubmitHandler<AddNewDocumentFormData> = async (data) => {
        setIsLoading(true);
        mutate(data);
    };
    const customHeight = '100%';
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
                customHeight={customHeight}
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
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton type="button" onClick={methods.handleSubmit(handleSave)}>
                            {isLoading ? <SaveLoaderButton /> : trans('button.save')}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
