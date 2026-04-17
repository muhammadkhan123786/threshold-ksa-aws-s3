import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls } from 'store/controlsSlice';
import { InputPdfController } from 'components/inputFilesController';
import * as Theme from './Theme';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'routers';
import { LabelInput } from 'components/labelInput';
import { useCreateMedicalFile } from 'services/hooks/coachDetails';

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

    const methods = useForm<AddNewMedicalFileFormData>({
        mode: 'all',
        defaultValues: defaultValues || {},
    });

    const handleSave: SubmitHandler<AddNewMedicalFileFormData> = async (data) => {
        const formData = new FormData();

        // Append form data fields
        formData.append('medicalFile', data.allergies?.value || '');
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
