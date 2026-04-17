import React, { useMemo } from 'react';
import { useLocales } from 'hooks/locales';
import { Body, Divider, NameInputsWrapper } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { InputController } from 'components/input';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdatePersonalInfo } from 'services/hooks';
import { setModalContent } from 'store/controlsSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdatePersonalInfoSchema } from 'schemas/athlete/addAtheleteBank';
import { MultiSelectController } from 'components/multi-selection';
import { addMonths, arrayToSelectOptions, getDateYearsFromNow } from 'libs/helpers';
import { Education, Gender, Nationality } from 'libs/enums';
import { InputDateController } from 'components/inputDate';
import { AthleteLevel } from 'libs/enums/athlete';

interface PersonalInfoFormData {
    firstName: string;
    lastName: string;
    joinDate: string;
    level: string;
    experience: string;
    education: string;
    schoolName: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    nationality: string;
    nin: string;
    ninExpirationDate: string;
    weight: string;
    height: string;
}

interface PersonalInfoFormProps {
    id?: string;
    defaultValues?: PersonalInfoFormData;
    handleCancel: () => void;
    handleSave?: (data: PersonalInfoFormData) => void;
}

export const PersonalInfoForm: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const { defaultValues, isModal, handleCancel, handleSave, id: athleteId } = props;
    const dispatch = useDispatch();

    const schema = useUpdatePersonalInfoSchema();

    const {
        formState: { isValid },
        getValues,
        control,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: defaultValues || {},
    });

    const updatePersonalInfoMutation = useUpdatePersonalInfo(athleteId);
    const queryClient = useQueryClient();
    const handleFormSave = async () => {
        const formData: PersonalInfoFormData = {
            firstName: getValues('firstName'),
            lastName: getValues('lastName'),
            joinDate: getValues('joinDate'),
            level: getValues('level')?.value,
            experience: getValues('experience'),
            education: getValues('education')?.value,
            schoolName: getValues('schoolName'),
            dateOfBirth: getValues('dateOfBirth'),
            gender: getValues('gender')?.value,
            nationality: getValues('nationality')?.value,
            nin: getValues('nin'),
            weight: getValues('weight'),
            height: getValues('height'),
            ninExpirationDate: getValues('ninExpirationDate'),
        };

        updatePersonalInfoMutation.mutate(formData, {
            onSuccess: (response) => {
                const isSuccess = [201, 200].includes(response.status);
                queryClient.invalidateQueries({ queryKey: ['athleteDetails'] });

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

    return (
        <Body>
            <FormRow
                title={trans('form.editAthleteProfile.name')}
                content={
                    <NameInputsWrapper>
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'firstName',
                                placeholder: trans('form.enterFirstName'),
                            }}
                        />
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'lastName',
                                placeholder: trans('form.enterLastName'),
                            }}
                        />
                    </NameInputsWrapper>
                }
            />

            <Divider />
            <FormRow
                title={trans('form.editAthletePersonalInfo.join')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'joinDate',
                            withPortal: !isModal,
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.level')}
                content={
                    // <InputController
                    //     type="text"
                    //     {...{
                    //         control,
                    //         name: 'level',
                    //         placeholder: trans('form.enterLevel'),
                    //     }}
                    // />
                    <MultiSelectController
                        {...{
                            control,
                            name: 'level',
                            options: arrayToSelectOptions({ array: AthleteLevel }),
                            transSuffix: 'profileLeveName.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('coach.personal.experience')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'experience',
                            placeholder: trans('form.enterExperince'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editAthletePersonalInfo.education')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'education',
                            options: arrayToSelectOptions({ array: Education }),
                            transSuffix: 'form.editAthletePersonalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('athlete.personal.school')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'schoolName',
                            placeholder: trans('athlete.personal.school'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editAthletePersonalInfo.birth')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'dateOfBirth',
                            withPortal: !isModal,
                        }}
                        maxDate={getDateYearsFromNow(5)}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editAthletePersonalInfo.gender')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'gender',
                            options: arrayToSelectOptions({ array: Gender }),
                            transSuffix: 'global.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editAthleteProfile.nationality')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'nationality',
                            options: arrayToSelectOptions({ array: Nationality }),
                            transSuffix: 'form.editAthleteProfile.',
                            menuPlacement: 'top',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addBranchManager.ninTitle')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'nin',
                            placeholder: trans('athlete.personal.nationalNumber'),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.ninExpire')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'ninExpirationDate',
                            withPortal: !isModal,
                            maxDate: addMonths(new Date(), 100),
                            minDate: new Date(),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('athlete.body.weight')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'weight',
                            placeholder: trans('athlete.body.weight'),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('athlete.body.height')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'height',
                            placeholder: trans('athlete.body.height'),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid}
                        handleSave={handleFormSave}
                        handleCancel={handleCancel}
                        saveText={isModal ? trans('form.save') : trans('form.save')}
                        cancelText={isModal ? trans('form.cancel') : 'form.cancel'}
                    />
                }
            />
        </Body>
    );
};
