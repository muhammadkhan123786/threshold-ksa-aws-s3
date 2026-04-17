import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import { MultiSelectController } from 'components/multi-selection';
import { InputPdfController } from 'components/inputFilesController';
import { arrayToSelectOptions } from 'libs/helpers';
import { YesNo, Consideration } from 'libs/enums';
import { FoodAllergies } from 'libs/enums/athlete';
import * as Theme from './Theme';
import { useUpdateMedicalInfo } from 'services/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAthletes } from 'hooks';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { useCreateMedicalFile } from 'services/hooks/coachDetails';
import { SharedButton } from 'components/sharedButton';

interface AddNewMedicalFileFormData {
    allergies: any;
    chronicDisease: any;
    injury: any;
    foodAllergies: any;
    consideration: any;
    foodAllergiesFile?: File;
    currentConsiderationFile?: File;
}

interface addNewMedicalModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: AddNewMedicalFileFormData;
}

export const AddNewMedicalFile: React.FC<addNewMedicalModalProps> = ({
    isOpen,
    onClose,
    defaultValues,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();
    const addMedicalFileMutation = useCreateMedicalFile(id);
    const methods = useForm<AddNewMedicalFileFormData>({
        mode: 'all',
        defaultValues: defaultValues || {},
    });

    const handleSave: SubmitHandler<AddNewMedicalFileFormData> = async (data) => {
        const formData = new FormData();

        // Append form data fields
        formData.append('medicalFile', data.allergies?.value || '');

        // addMedicalFileMutation.mutate(formData, {
        //     onSuccess: (response) => {
        //         const isSuccess = [200, 201].includes(response.status);
        //         queryClient.invalidateQueries({ queryKey: ['medicalInfo'] });

        //         dispatch(
        //             setModalContent({
        //                 modalContent: {
        //                     type: isSuccess ? 'success' : 'warning',
        //                     title: isSuccess ? trans('form.success') : trans('form.warning'),
        //                     subtitle: isSuccess
        //                         ? trans('medicalInfo.updatedSuccessfully')
        //                         : response.message || trans('form.error_occurred'),
        //                 },
        //             }),
        //         );
        //         if (isSuccess) onClose();
        //     },
        //     onError: (error: Error) => {
        //         dispatch(
        //             setModalContent({
        //                 modalContent: {
        //                     type: 'warning',
        //                     title: trans('form.warning'),
        //                     subtitle: error.message || trans('form.error_occurred'),
        //                 },
        //             }),
        //         );
        //     },
        // });
    };
    const customHeight = '100%';
    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                customHeight={customHeight}
                title={trans('medicalInfo.editTitle')}
            >
                <Theme.Body>
                    <Theme.LineHR />

                    <Theme.InputsWrapper>
                        <LabelInput label={trans('coach.profile.add.newMedicalFile')} />
                        <InputPdfController
                            name="medicalFile"
                            control={methods.control}
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

                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton onClick={methods.handleSubmit(handleSave)}>
                            <img
                                src="/assets/icons/add-icon-colored.svg"
                                height={20}
                                width={20}
                                alt="Save Icon"
                            />
                            {trans('form.save')}
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
