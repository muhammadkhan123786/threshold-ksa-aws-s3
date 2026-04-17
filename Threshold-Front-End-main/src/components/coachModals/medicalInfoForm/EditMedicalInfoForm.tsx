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
import { useUpdateMedicalFile } from 'services/hooks/coachDetails';

interface MedicalFilesModalFormData {
    allergies: any;
    chronicDisease: any;
    injury: any;
    foodAllergies: any;
    consideration: any;
    foodAllergiesFile?: File;
    currentConsiderationFile?: File;
}

interface medicalFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: MedicalFilesModalFormData;
}

export const MedicalFilesModal: React.FC<medicalFilesModalProps> = ({
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

    const methods = useForm<MedicalFilesModalFormData>({
        mode: 'all',
        defaultValues: defaultValues || {},
    });

    const handleSave: SubmitHandler<MedicalFilesModalFormData> = async (data) => {
        const formData = new FormData();

        // Append form data fields
        formData.append('allergies', data.allergies?.value || '');
        formData.append('chronicDisease', data.chronicDisease?.value || '');
        formData.append('foodAllergies', data.foodAllergies?.value || '');
        formData.append('consideration', data.consideration?.value || '');
        formData.append('foodAllergiesFile', data.foodAllergiesFile || '');
        formData.append('currentConsiderationFile', data.currentConsiderationFile || '');
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
                        <InputPdfController
                            name="currentConsiderationFile"
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
                        <Theme.SubmitButton
                            type="button"
                            onClick={methods.handleSubmit(handleSave)}
                        >
                            <img
                                src="/assets/icons/add-icon-colored.svg"
                                height={20}
                                width={20}
                                alt="Save Icon"
                            />
                            {trans('form.save')}
                        </Theme.SubmitButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
