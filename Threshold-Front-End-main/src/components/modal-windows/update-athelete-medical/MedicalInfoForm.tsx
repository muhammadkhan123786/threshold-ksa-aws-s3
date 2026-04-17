import React, { useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { Body, Divider, UploadText } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { InputController } from 'components/input';
import ButtonsControls from '../ButtonsControls';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateMedicalInfo } from 'services/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateMedicalInfoSchema } from 'schemas/athlete/addAtheleteBank';
import { InputFileController } from 'components/inputFile';
import { InputPdfController } from 'components/inputFilesController';
import { setModalContent } from 'store/controlsSlice';
import { useDispatch } from 'react-redux';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { Consideration, YesNo } from 'libs/enums';
import { CHRONIC_DISEASES } from 'libs/constants';
import { FoodAllergies } from 'libs/enums/athlete';
interface MedicalInfoFormData {
    allergies: any;
    chronicDisease: any;
    injury: any;
    foodAllergies: any;
    consideration: any;
    foodAllergiesFile?: any | File;
    currentConsiderationFile?: any | File;
}

interface MedicalInfoFormProps {
    id?: string;
    defaultValues?: MedicalInfoFormData;
    handleCancel: () => void;
    handleSave?: (data: MedicalInfoFormData) => void;
}

export const MedicalInfoForm: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const { defaultValues, isModal, handleCancel, handleSave, id: athleteId } = props;

    const createSchema = useUpdateMedicalInfoSchema();

    const { control, handleSubmit, getValues, watch, trigger } = useForm({
        mode: 'all',
        resolver: yupResolver(createSchema),
        defaultValues: defaultValues || {},
    });

    const updateMedicalInfoMutation = useUpdateMedicalInfo(athleteId);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const handleFormSave = async (data: MedicalInfoFormData) => {
        const formData = new FormData();
        const allergies = data?.allergies?.value
            ? data?.allergies?.value
            : defaultValues?.allergies;
        const chronicDisease = data?.chronicDisease?.value
            ? data?.chronicDisease?.value
            : defaultValues?.chronicDisease;

        const foodAllergies = data?.foodAllergies?.value
            ? data?.foodAllergies?.value
            : defaultValues?.foodAllergies;

        const consideration = data?.consideration?.value
            ? data?.consideration?.value
            : defaultValues?.consideration;

        const foodAllergiesFile = data?.foodAllergiesFile
            ? data?.foodAllergiesFile
            : defaultValues?.foodAllergiesFile
              ? defaultValues?.foodAllergiesFile
              : '';

        const currentConsiderationFile = data?.currentConsiderationFile
            ? data?.currentConsiderationFile
            : defaultValues?.currentConsiderationFile
              ? defaultValues?.currentConsiderationFile
              : '';

        formData.append('allergies', allergies);
        formData.append('chronicDisease', chronicDisease);
        formData.append('foodAllergies', foodAllergies);
        formData.append('consideration', consideration);
        formData.append('foodAllergiesFile', foodAllergiesFile),
            formData.append('currentConsiderationFile', currentConsiderationFile);

        // No need to log formData values directly; they will be handled by the network request
        updateMedicalInfoMutation.mutate(formData, {
            onSuccess: (response) => {
                const isSuccess =
                    [201, 200].includes(response.status) ||
                    response.message === 'Medical information updated successfully';
                queryClient.invalidateQueries({ queryKey: ['medicalInfo'] });
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: isSuccess ? 'success' : 'warning',
                            title: isSuccess ? trans('form.success') : trans('form.warning'),
                            subtitle: isSuccess
                                ? trans('personal_info.updated_successfully')
                                : response.message || trans('form.error_occurred'),
                        },
                    }),
                );

                if (handleSave) {
                    handleSave(formData);
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

    const selectIsValid = useMemo(
        () => !!watch('allergies') && !!watch('chronicDisease'),
        [watch('allergies'), watch('chronicDisease')],
    );

    return (
        <Body>
            <FormRow
                title={trans('athlete.medical.allergies')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'allergies',
                            options: arrayToSelectOptions({ array: YesNo }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />

            <Divider />
            <FormRow
                title={trans('athlete.medical.chronic')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'chronicDisease',
                            autocomplete: 'chronicDisease',
                            options: arrayToSelectOptions({ array: YesNo }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.medical.foodAllergies')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'foodAllergies',
                            options: arrayToSelectOptions({ array: FoodAllergies }),
                            transSuffix: 'foodAllergies.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editMedicalInfo.consideration')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'consideration',
                            options: arrayToSelectOptions({ array: Consideration }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                        // transSuffix="athlete.medicalInfo.consideration"
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.medical.foodAllergiesFile')}
                content={
                    <InputPdfController
                        {...{
                            control,
                            trigger,
                            name: 'foodAllergiesFile',
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
                title={trans('athlete.medical.considerationFile')}
                content={
                    <InputPdfController
                        {...{
                            control,
                            trigger,
                            name: 'currentConsiderationFile',
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
                        isValid={selectIsValid}
                        handleSave={handleSubmit(handleFormSave)}
                        handleCancel={handleCancel}
                        saveText={isModal ? trans('form.save') : trans('form.submit')}
                        cancelText={isModal ? trans('form.cancel') : trans('form.cancel')}
                    />
                }
            />
        </Body>
    );
};
