import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdatePersonalInfoSchema } from 'schemas/player/useUpdatePersonalInfoSchema';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls, setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { router } from 'routers';
import { useEditPlayerPersonalInformation } from 'services/hooks/players/useEditPlayerPersonalInformation';
import { LabelInput } from 'components/labelInput';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { addMonths, arrayToSelectOptions } from 'libs/helpers';
import { Divider } from 'components/modal-windows';
import { Education, Gender, Nationality, SkillLevel } from 'libs/enums';
import { InputDateController } from 'components/inputDate';
import { InputController } from 'components/input';
import { useFetchAthleteDetailsById } from 'services/hooks/players/useFetchAthleteDetailsById';
import { SharedButton } from 'components/sharedButton';
import { FilePickerController } from 'components/filePicker/FilePickerController';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface EditPlayerPersonalInformationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditPlayerPersonalInformationForm {
    payload: any;
    firstName: string;
    lastName: string;
    joinDate: Date;
    level: any;
    experience: any;
    education: any;
    schoolName: any;
    dateOfBirth: any;
    gender: any;
    nationality: any;
    nin: string;
    ninExpirationDate: any;
    weight: number | 0;
    height: number | 0;
    avatar?: any;
}

export const EditPlayerPersonalInformation: React.FC<EditPlayerPersonalInformationModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();

    const { data: athlete, refetch } = useFetchAthleteDetailsById(id || '');
    const [isLoading, setIsLoading] = useState(false);

    const schema = useUpdatePersonalInfoSchema();
    const methods = useForm<EditPlayerPersonalInformationForm>({
        mode: 'all',
        resolver: yupResolver(schema) as any,
    });

    // Set form default values after athlete data is fetched
    useEffect(() => {
        if (athlete) {
            methods.reset({
                firstName: athlete.firstName,
                lastName: athlete.lastName,
                joinDate: athlete.joinDate,
                level: athlete.level,
                experience: athlete.experience,
                education: athlete.education,
                schoolName: athlete.schoolName,
                dateOfBirth: athlete.dateOfBirth,
                gender: athlete.gender,
                nationality: athlete.nationality,
                nin: athlete.nin,
                ninExpirationDate: athlete.ninExpirationDate,
                weight: athlete.weight || undefined,
                height: athlete.height || undefined,
            });
        }
    }, [athlete, methods]);

    const { mutate } = useEditPlayerPersonalInformation(id, {
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
            refetch();
            onClose();
            setIsLoading(false);
        },
        onError: (error) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message || trans('form.error_occurred'),
                    },
                }),
            );
            onClose();
            setIsLoading(false);
        },
    });

    const handleSave: SubmitHandler<EditPlayerPersonalInformationForm> = (data) => {
        setIsLoading(true);

        try {
            mutate({
                firstName: data.firstName,
                lastName: data.lastName,
                joinDate: data.joinDate,
                level: data.level.value,
                experience: data.experience,
                education: data.education.value,
                schoolName: data.schoolName,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender.value,
                nationality: arrayToSelectOptions({ array: Nationality }).find(
                    (option) => option.value === data?.payload?.nationality,
                )?.value as any,
                nin: data.nin,
                ninExpirationDate: data.ninExpirationDate,
                weight: data.weight || 0,
                height: data.height || 0,
                avatar: data.avatar,
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.error'),
                        subtitle: trans('form.error_occurred'),
                    },
                }),
            );
            onClose();
        }
    };

    const { control } = methods;

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                customHeight="100%"
                title={trans('player.Edit.personalInformation')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    {/* First Name Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.firstName')} />
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    type="text"
                                    placeholder={trans('player.Edit.firstName')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    {/* Last Name Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.lastName')} />
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    type="text"
                                    placeholder={trans('player.Edit.lastName')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    {/* Join Date Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('player.Edit.joinDate')}
                            content={
                                <InputDateController control={methods.control} name="joinDate" />
                            }
                        />
                    </Theme.InputsWrapper>
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('label.avatar')}
                            content={
                                <FilePickerController
                                    {...{
                                        control,
                                        name: 'avatar',
                                        placeholder: trans('placeholder.avatar'),
                                        accept: 'image/*',
                                        maxFiles: 1,
                                    }}
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                    {/* Level Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('label.level')}
                            content={
                                <MultiSelectController
                                    control={control}
                                    name="level"
                                    options={arrayToSelectOptions({ array: SkillLevel })}
                                    transSuffix="form.add.player."
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* Experience Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.experience')} />
                        <Controller
                            control={control}
                            name="experience"
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    type="text"
                                    placeholder={trans('player.Edit.experience')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    {/* Education Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('player.Edit.education')}
                            content={
                                <MultiSelectController
                                    control={control}
                                    name="education"
                                    options={arrayToSelectOptions({ array: Education })}
                                    transSuffix="form.editAthleteProfile."
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* School Name Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.schoolName')} />
                        <Controller
                            control={control}
                            name="schoolName"
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    type="text"
                                    placeholder={trans('player.Edit.schoolName')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    {/* Date of Birth Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('player.Edit.dateOfBirth')}
                            content={<InputDateController control={control} name="dateOfBirth" />}
                        />
                    </Theme.InputsWrapper>

                    {/* Gender Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('player.Edit.gender')}
                            content={
                                <MultiSelectController
                                    control={control}
                                    name="gender"
                                    options={arrayToSelectOptions({ array: Gender })}
                                    transSuffix="form.editAthletePersonalInfo."
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* Nationality Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('player.Edit.nationality')}
                            content={
                                <MultiSelectController
                                    control={control}
                                    name="nationality"
                                    options={arrayToSelectOptions({ array: Nationality })}
                                    transSuffix="form.editAthleteProfile."
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* NIN Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.nin')} />
                        <Controller
                            control={control}
                            name="nin"
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    control={control}
                                    type="text"
                                    placeholder={trans('player.Edit.nin')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    {/* NIN Expiration Date Input */}
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{ display: 'block', color: '#7d7d7d' }}
                            title={trans('player.Edit.ninExpirationDate')}
                            content={
                                <InputDateController
                                    control={control}
                                    name="ninExpirationDate"
                                    maxDate={addMonths(new Date(), 100)}
                                    minDate={new Date()}
                                />
                            }
                        />
                    </Theme.InputsWrapper>

                    {/* Weight Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.weight')} />
                        <Controller
                            control={control}
                            name="weight"
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    type="number"
                                    control={control}
                                    placeholder={trans('player.Edit.weight')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    {/* Height Input */}
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('player.Edit.height')} />
                        <Controller
                            control={control}
                            name="height"
                            render={({ field }) => (
                                <InputController
                                    {...field}
                                    type="number"
                                    control={control}
                                    placeholder={trans('player.Edit.height')}
                                />
                            )}
                        />
                    </Theme.InputsWrapper>

                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton variant="primary" onClick={methods.handleSubmit(handleSave)}>
                            <>{isLoading ? <SaveLoaderButton /> : trans('button.save')}</>
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
